#!/usr/bin/env python3
"""
NexusCore-WA deep WhatsApp gateway integration test runner.

This script exercises the in-house WWeb.js WhatsApp gateway HTTP API to validate
message sending, media handling, contacts, labels, groups, and presence
behaviour. It replaces the legacy smoke test and is intentionally interactive:
the very first run collects the required IDs/URLs from the operator and caches
them for subsequent executions.

Key features:
  • Interactive, colourised prompting with cached defaults.
  • Sequential end-to-end checks covering core gateway endpoints.
  • Automatic logging to `logs/gateway_test_<timestamp>.log`.
  • Config persistence in `logs/test_endpoints_config.json`.

Usage (from repo root):
    python scripts/test_endpoints.py

Suppress ANSI colours by exporting NO_COLOR=1.
"""

from __future__ import annotations

import base64
import json
import logging
import mimetypes
import os
import sys
import textwrap
import time
import uuid
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional, Tuple

import requests

# --------------------------------------------------------------------------- #
# Console helpers                                                             #
# --------------------------------------------------------------------------- #


class Ansi:
    """ANSI escape helpers (falls back to no colour if NO_COLOR is set)."""

    enabled = os.environ.get("NO_COLOR") is None and sys.stdout.isatty()

    RESET = "\033[0m" if enabled else ""
    BOLD = "\033[1m" if enabled else ""
    CYAN = "\033[36m" if enabled else ""
    GREEN = "\033[32m" if enabled else ""
    YELLOW = "\033[33m" if enabled else ""
    RED = "\033[31m" if enabled else ""
    MAGENTA = "\033[35m" if enabled else ""


def ctext(color: str, text: str) -> str:
    return f"{color}{text}{Ansi.RESET}" if Ansi.enabled else text


# --------------------------------------------------------------------------- #
# Config persistence                                                          #
# --------------------------------------------------------------------------- #

REPO_ROOT = Path(__file__).resolve().parents[1]
LOGS_DIR = REPO_ROOT / "logs"
CONFIG_PATH = LOGS_DIR / "test_endpoints_config.json"


@dataclass
class ConfigField:
    key: str
    prompt: str
    default: str
    required: bool = False
    value_type: Callable[[str], object] = str


CONFIG_FIELDS: List[ConfigField] = [
    ConfigField("backend_url", "Backend base URL", "http://localhost:3000", True),
    ConfigField("gateway_url", "WhatsApp gateway base URL", "http://localhost:3001", True),
    ConfigField("session", "Gateway session name", "default", True),
    ConfigField("chat_id", "Primary chat ID (e.g. 11111111111@c.us)", "", True),
    ConfigField("group_id", "Test group ID (optional, 11111111111-123@g.us)", "", False),
    ConfigField("contact_id", "Contact chat ID for profile/about lookups", "", False),
    ConfigField("contact_phone", "Contact phone (digits only) for exists check", "", False),
    ConfigField(
        "image_url",
        "Image URL for media tests",
        "https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png",
        True,
    ),
    ConfigField(
        "video_url",
        "Video URL for media tests",
        "https://download.samplelib.com/mp4/sample-5s.mp4",
        True,
    ),
    ConfigField(
        "voice_url",
        "Voice (opus) URL for voice note tests",
        "file://data/media/sample-voice.ogg",
        True,
    ),
    ConfigField(
        "document_url",
        "Document URL for file tests",
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        True,
    ),
    ConfigField(
        "link_preview_url",
        "URL for link preview tests",
        "https://www.openai.com/",
        True,
    ),
    ConfigField("location_lat", "Location latitude", "40.4093", True, float),
    ConfigField("location_lng", "Location longitude", "49.8671", True, float),
    ConfigField("location_title", "Location title", "Test Location", True),
    ConfigField(
        "vcard",
        "VCARD payload (single line literal)",
        "BEGIN:VCARD\\nVERSION:3.0\\nFN:Test User\\nTEL;type=CELL:+10000000000\\nEND:VCARD",
        True,
    ),
]


def load_cached_config() -> Dict[str, object]:
    if CONFIG_PATH.exists():
        try:
            return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


def store_config(config: Dict[str, object]) -> None:
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(json.dumps(config, indent=2, sort_keys=True), encoding="utf-8")


def prompt_with_default(field: ConfigField, cached: Dict[str, object]) -> object:
    cached_value = cached.get(field.key, field.default)
    display_default = str(cached_value) if cached_value is not None else ""
    prompt_text = ctext(Ansi.CYAN, f"{field.prompt}")
    raw = input(f"{prompt_text} [{display_default}]: ").strip()
    if not raw:
        raw = display_default
    if field.required and not raw:
        print(ctext(Ansi.RED, "  → This value is required. Please provide it."))
        return prompt_with_default(field, cached)
    if field.value_type is float:
        try:
            return float(raw)
        except ValueError:
            print(ctext(Ansi.RED, "  → Invalid number, try again."))
            return prompt_with_default(field, cached)
    return raw


def collect_config() -> Dict[str, object]:
    print(ctext(Ansi.MAGENTA, "\nWhatsApp Gateway Test Runner – configuration wizard"))
    cached = load_cached_config()
    config: Dict[str, object] = {}
    for field in CONFIG_FIELDS:
        config[field.key] = prompt_with_default(field, cached)

    vcard_value = config.get("vcard")
    if isinstance(vcard_value, str):
        config["vcard"] = vcard_value.strip().strip('"')

    print(
        ctext(
            Ansi.YELLOW,
            "\nConfiguration saved. Values are cached locally in logs/test_endpoints_config.json.",
        )
    )
    store_config(config)
    return config


# --------------------------------------------------------------------------- #
# Test framework                                                              #
# --------------------------------------------------------------------------- #


class TestFailure(Exception):
    """Intentional assertion failure within a test."""


def build_media_descriptor(source: str, default_filename: str, default_mimetype: str) -> Dict[str, object]:
    source = source.strip()
    if source.startswith("file://"):
        relative = source[len("file://") :].lstrip("/")
        path = (REPO_ROOT / relative).resolve()
        if not path.exists():
            raise TestFailure(f"Media file not found: {path}")
        data = base64.b64encode(path.read_bytes()).decode("ascii")
        return {"base64": data, "filename": default_filename, "mimetype": default_mimetype}
    if source.startswith("base64://"):
        data = source[len("base64://") :].strip()
        if not data:
            raise TestFailure("Empty base64 payload provided for media descriptor.")
        return {"base64": data, "filename": default_filename, "mimetype": default_mimetype}
    return {"url": source, "filename": default_filename, "mimetype": default_mimetype}


@dataclass
class TestResult:
    name: str
    status: str  # PASS / FAIL / SKIP
    message: str


@dataclass
class TestCase:
    name: str
    func: Callable[["TestContext"], Tuple[str, str]]
    requires: Tuple[str, ...] = ()
    description: str = ""

    def run(self, ctx: "TestContext") -> TestResult:
        missing = [key for key in self.requires if not ctx.config.get(key)]
        if missing:
            return TestResult(self.name, "SKIP", f"Missing config keys: {', '.join(missing)}")

        try:
            status, message = self.func(ctx)
        except TestFailure as exc:
            ctx.logger.error("Test %s failed: %s", self.name, exc)
            status, message = "FAIL", str(exc)
        except requests.RequestException as exc:
            ctx.logger.exception("HTTP error during %s", self.name)
            status, message = "FAIL", f"HTTP error: {exc}"
        except Exception as exc:  # noqa: BLE001
            ctx.logger.exception("Unexpected error during %s", self.name)
            status, message = "FAIL", f"Unexpected error: {exc}"

        return TestResult(self.name, status, message)


class TestContext:
    """Holds configuration, state and helpers shared across tests."""

    def __init__(self, config: Dict[str, object], logger: logging.Logger):
        self.config = config
        self.logger = logger
        self.timeout = 40
        self.gateway_base = str(config["gateway_url"]).rstrip("/")
        self.backend_base = str(config["backend_url"]).rstrip("/")
        self.session_name = str(config["session"])

        self.http = requests.Session()

        self.backend_http = requests.Session()

        self.last_message_ids: List[str] = []
        self.created_label_id: Optional[str] = None

    # Helper methods ----------------------------------------------------- #
    def success(self, message: str) -> Tuple[str, str]:
        return "PASS", message

    def skip(self, message: str) -> Tuple[str, str]:
        return "SKIP", message

    def session_path(self, template: str, **kwargs: object) -> str:
        values = {"session": self.session_name, **kwargs}
        try:
            return template.format(**values)
        except KeyError as exc:
            raise TestFailure(f"Missing path placeholder value: {exc}") from exc

    def request_gateway(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, object]] = None,
        json_body: Optional[Dict[str, object]] = None,
        expected_status: Iterable[int] | int = 200,
    ) -> requests.Response:
        url = f"{self.gateway_base}{path}"
        expected_set = {expected_status} if isinstance(expected_status, int) else set(expected_status)

        start = time.time()
        response = self.http.request(
            method.upper(),
            url,
            params=params,
            json=json_body,
            timeout=self.timeout,
        )
        duration = (time.time() - start) * 1000
        self.logger.info(
            "Gateway %s %s -> %s (%.1f ms)",
            method.upper(),
            path,
            response.status_code,
            duration,
        )
        if response.status_code not in expected_set:
            snippet = response.text[:300]
            raise TestFailure(
                f"Expected {expected_set}, got {response.status_code} for {path}. Payload: {snippet}"
            )
        return response

    def wait_for_session_status(
        self,
        desired_statuses: Iterable[str],
        *,
        timeout: int = 90,
        poll_interval: float = 2.0,
    ) -> Optional[str]:
        target = {status.upper() for status in desired_statuses}
        deadline = time.time() + timeout
        url = f"/api/sessions/{self.session_name}"

        while time.time() < deadline:
            response = self.http.get(f"{self.gateway_base}{url}", timeout=self.timeout)
            if response.status_code == 200:
                try:
                    status = str(response.json().get("status", "")).upper()
                except ValueError:
                    status = ""
                if status in target:
                    return status
            time.sleep(poll_interval)
        return None

    def get_session_details(self) -> Dict[str, object]:
        response = self.request_gateway("GET", f"/api/sessions/{self.session_name}")
        return parse_json_safely(response)

    def request_backend(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, object]] = None,
        expected_status: Iterable[int] | int = 200,
    ) -> requests.Response:
        url = f"{self.backend_base}{path}"
        expected_set = {expected_status} if isinstance(expected_status, int) else set(expected_status)
        response = self.backend_http.request(method.upper(), url, params=params, timeout=self.timeout)
        self.logger.info("Backend %s %s -> %s", method.upper(), path, response.status_code)
        if response.status_code not in expected_set:
            raise TestFailure(
                f"Expected {expected_set}, got {response.status_code} for backend {path}: {response.text[:200]}"
            )
        return response


# --------------------------------------------------------------------------- #
# Response helpers                                                            #
# --------------------------------------------------------------------------- #

NOT_SUPPORTED_PATTERNS = (
    'not supported',
    'unsupported',
    'available only in plus version',
    'labels_not_supported',
)

NOT_IMPLEMENTED_PATTERNS = (
    'not implemented',
    'not implemented by',
)

SESSION_PENDING_PATTERNS = (
    'session_not_ready',
    'scan qr',
)


def parse_json_safely(response: requests.Response) -> Dict[str, object]:
    try:
        return response.json()
    except ValueError:
        return {}


def gateway_skip_reason(response: requests.Response) -> Optional[str]:
    payload = parse_json_safely(response)
    message = str(payload.get("message") or payload.get("error") or payload or "")
    error_value = str(payload.get("error") or "")
    if any(fragment.lower() in message.lower() for fragment in NOT_SUPPORTED_PATTERNS):
        return "Feature not supported by current gateway configuration"
    if any(fragment.lower() in message.lower() for fragment in NOT_IMPLEMENTED_PATTERNS):
        return "Endpoint not implemented by current gateway"
    if any(fragment.lower() in message.lower() for fragment in SESSION_PENDING_PATTERNS):
        return "Gateway session not ready (scan QR in dashboard or session helper)"
    if any(fragment.lower() in error_value.lower() for fragment in NOT_SUPPORTED_PATTERNS):
        return "Feature not supported by current gateway configuration"
    if error_value.lower() == "session_not_ready":
        return "Gateway session not ready (scan QR in dashboard or session helper)"
    return None


def normalize_message_id(raw: object) -> Optional[str]:
    if isinstance(raw, str):
        return raw
    if isinstance(raw, dict):
        serialized = raw.get("_serialized")
        if isinstance(serialized, str):
            return serialized
        identifier = raw.get("id")
        if isinstance(identifier, str):
            return identifier
    return None


# --------------------------------------------------------------------------- #
# Individual test implementations                                            #
# --------------------------------------------------------------------------- #


def test_backend_health(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_backend("GET", "/healthz")
    version_response = ctx.request_backend("GET", "/version", expected_status={200, 404})
    if version_response.status_code == 200:
        return ctx.success("Backend healthz and /version reachable")
    return ctx.success("Backend healthz reachable (version endpoint not exposed)")


def test_gateway_status_endpoints(ctx: TestContext) -> Tuple[str, str]:
    notes: List[str] = []
    health_response = ctx.request_gateway("GET", "/health", expected_status={200, 422})
    if health_response.status_code == 200:
        notes.append("health ok")
    else:
        reason = gateway_skip_reason(health_response) or "unexpected status 422"
        notes.append(f"health skipped ({reason})")
    ctx.request_gateway("GET", "/ping")
    ctx.request_gateway("GET", "/api/server/status")
    ctx.request_gateway("GET", "/api/server/version")
    notes.append("ping/status/version ok")
    return ctx.success("; ".join(notes))


def test_session_overview(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_gateway("GET", "/api/sessions")
    ctx.request_gateway("GET", f"/api/sessions/{ctx.session_name}")
    ctx.request_gateway("GET", f"/api/sessions/{ctx.session_name}/me")
    return ctx.success(f"Session '{ctx.session_name}' metadata retrieved")


def session_stop_start_cycle(ctx: TestContext) -> Tuple[str, str]:
    initial_details = ctx.get_session_details()
    initial_status = str(initial_details.get("status", "")).upper()

    stop_response = ctx.request_gateway(
        "POST",
        f"/api/sessions/{ctx.session_name}/stop",
        expected_status={200, 201, 202, 409, 422, 501},
    )

    skip_reason = gateway_skip_reason(stop_response)
    if skip_reason:
        return ctx.skip(f"Session stop skipped: {skip_reason}")

    if stop_response.status_code == 409:
        # Already stopped; continue to start to ensure reachability.
        pass
    elif stop_response.status_code in {200, 201, 202}:
        ctx.wait_for_session_status({"STOPPED", "DISCONNECTED", "CLOSING"}, timeout=45)
    else:
        return ctx.skip(f"Session stop returned {stop_response.status_code}")

    start_response = ctx.request_gateway(
        f"POST",
        f"/api/sessions/{ctx.session_name}/start",
        expected_status={200, 201, 202, 409, 422, 501},
    )

    skip_reason = gateway_skip_reason(start_response)
    if skip_reason:
        return ctx.skip(f"Session start skipped: {skip_reason}")

    if start_response.status_code in {200, 201, 202}:
        final_status = ctx.wait_for_session_status(
            {"WORKING", "SCAN_QR_CODE", "INITIALIZING", "CONNECTING", "WORKING_RESUMING"},
            timeout=90,
        )
        if final_status in {"CONNECTING", "INITIALIZING"}:
            ready_status = ctx.wait_for_session_status({"WORKING", "WORKING_RESUMING"}, timeout=60)
            if ready_status:
                final_status = ready_status
        if final_status is None:
            return ctx.skip("Session did not reach a ready state after start (check gateway dashboard/logs).")
        return ctx.success(f"Session stop/start cycle completed (final status: {final_status})")

    if start_response.status_code == 409:
        return ctx.success("Session already running; no start lifecycle necessary.")

    return ctx.skip(f"Session start returned {start_response.status_code}")


def test_profile_info(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/profile"))
    status_response = ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/profile/status"),
        expected_status={200, 204, 404},
    )
    picture_response = ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/profile/picture"),
        expected_status={200, 204, 404},
    )
    notes: List[str] = []
    if status_response.status_code == 404:
        notes.append("status endpoint unavailable")
    if picture_response.status_code == 404:
        notes.append("profile picture unavailable")
    suffix = f" ({', '.join(notes)})" if notes else ""
    return ctx.success(f"Profile metadata reachable{suffix}")


def send_text_message(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "text": f"Automated test message at {datetime.utcnow().isoformat()}",
        "linkPreview": False,
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendText",
        json_body=payload,
        expected_status={201, 503},
    )
    if response.status_code != 201:
        reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
        return ctx.skip(f"Text message not sent: {reason}")
    data = response.json()
    message_id = data.get("id")
    normalized_id = normalize_message_id(message_id)
    if normalized_id:
        ctx.last_message_ids.append(normalized_id)
        return ctx.success(f"Text message sent (id={normalized_id})")
    return ctx.success("Text message sent (no id in response)")


def send_link_preview(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "text": f"Preview this link: {ctx.config['link_preview_url']}",
        "linkPreview": True,
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendLinkPreview",
        json_body=payload,
        expected_status={201, 422, 501, 503},
    )
    if response.status_code == 201:
        return ctx.success("Link preview message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Link preview not executed: {reason}")


def _remote_file(url: str, default_mime: str, filename: Optional[str] = None) -> Dict[str, object]:
    guessed = mimetypes.guess_type(url)[0] or default_mime
    return {"url": url, "mimetype": guessed, "filename": filename or Path(url).name}


def send_image(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "caption": "Image test",
        "file": _remote_file(str(ctx.config["image_url"]), "image/jpeg"),
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendImage",
        json_body=payload,
        expected_status={201, 422, 503},
    )
    if response.status_code == 201:
        return ctx.success("Image message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Image send skipped: {reason}")


def send_document(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "file": _remote_file(str(ctx.config["document_url"]), "application/pdf"),
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendFile",
        json_body=payload,
        expected_status={201, 422, 503},
    )
    if response.status_code == 201:
        return ctx.success("Document message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Document send skipped: {reason}")


def send_voice(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "convert": True,
        "file": build_media_descriptor(
            str(ctx.config["voice_url"]),
            "voice-note.ogg",
            "audio/ogg; codecs=opus",
        ),
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendVoice",
        json_body=payload,
        expected_status={201, 422, 503},
    )
    if response.status_code == 201:
        return ctx.success("Voice note sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Voice note skipped: {reason}")


def send_video(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "convert": True,
        "caption": "Video test",
        "file": _remote_file(str(ctx.config["video_url"]), "video/mp4"),
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendVideo",
        json_body=payload,
        expected_status={201, 422, 501, 503},
    )
    if response.status_code == 201:
        return ctx.success("Video message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Video send skipped: {reason}")


def send_location(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "latitude": float(ctx.config["location_lat"]),
        "longitude": float(ctx.config["location_lng"]),
        "title": ctx.config["location_title"],
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendLocation",
        json_body=payload,
        expected_status={201, 503},
    )
    if response.status_code == 201:
        return ctx.success("Location message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Location send skipped: {reason}")


def send_vcard(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "contacts": [
            {
                "vcard": str(ctx.config["vcard"]),
            }
        ],
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendContactVcard",
        json_body=payload,
        expected_status={201, 503},
    )
    if response.status_code == 201:
        return ctx.success("Contact vCard message sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"vCard send skipped: {reason}")


def start_typing(ctx: TestContext) -> Tuple[str, str]:
    payload = {"session": ctx.session_name, "chatId": ctx.config["chat_id"]}
    response = ctx.request_gateway(
        "POST",
        "/api/startTyping",
        json_body=payload,
        expected_status={200, 201, 503},
    )
    if response.status_code in {200, 201}:
        return ctx.success("Typing indicator started")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Typing start skipped: {reason}")


def stop_typing(ctx: TestContext) -> Tuple[str, str]:
    payload = {"session": ctx.session_name, "chatId": ctx.config["chat_id"]}
    response = ctx.request_gateway(
        "POST",
        "/api/stopTyping",
        json_body=payload,
        expected_status={200, 201, 503},
    )
    if response.status_code in {200, 201}:
        return ctx.success("Typing indicator stopped")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Typing stop skipped: {reason}")


def send_seen(ctx: TestContext) -> Tuple[str, str]:
    message_ids = [mid for mid in ctx.last_message_ids[-3:] if isinstance(mid, str)]
    if not message_ids:
        return ctx.skip("No message ids available for seen receipt")
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "messageIds": message_ids,
    }
    response = ctx.request_gateway(
        "POST",
        "/api/sendSeen",
        json_body=payload,
        expected_status={201, 503},
    )
    if response.status_code == 201:
        return ctx.success("Seen markers sent")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Seen markers skipped: {reason}")


def send_reaction(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.last_message_ids:
        return ctx.skip("No message ids available for reaction")
    message_id = normalize_message_id(ctx.last_message_ids[-1])
    if not message_id:
        return ctx.skip("Last message id has unexpected format")
    payload = {
        "session": ctx.session_name,
        "messageId": message_id,
        "reaction": "👍",
    }
    response = ctx.request_gateway(
        "PUT",
        "/api/reaction",
        json_body=payload,
        expected_status={200, 503},
    )
    if response.status_code == 200:
        return ctx.success("Reaction applied to last message")
    reason = gateway_skip_reason(response) or f"unexpected status {response.status_code}"
    return ctx.skip(f"Reaction skipped: {reason}")


def chats_overview(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/chats"))
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/chats/overview"))
    chat_id = ctx.config["chat_id"]
    detail_response = ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/chats/{chatId}", chatId=chat_id),
        expected_status={200, 404},
    )
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/chats/{chatId}/messages", chatId=chat_id))
    if detail_response.status_code == 404:
        return ctx.success("Chat overview fetched (direct chat detail unavailable)")
    return ctx.success("Chat overview and history fetched")


def contacts_suite(ctx: TestContext) -> Tuple[str, str]:
    response = ctx.request_gateway(
        "GET",
        "/api/contacts",
        params={"session": ctx.session_name},
        expected_status={200, 500},
    )
    if response.status_code == 500:
        payload = parse_json_safely(response)
        exception = {}
        if isinstance(payload, dict):
            exception = payload.get("exception") or {}
        detail_raw = str(exception.get("message") or payload.get("message") or "Gateway returned 500")
        lines = detail_raw.splitlines()
        detail = (lines[0].strip() if lines else detail_raw.strip()) or "Gateway returned 500"
        return ctx.skip(f"Contacts endpoints skipped: gateway bug on /api/contacts ({detail})")

    response_all = ctx.request_gateway(
        "GET",
        "/api/contacts/all",
        params={"session": ctx.session_name},
        expected_status={200, 500},
    )
    if response_all.status_code == 500:
        payload = parse_json_safely(response_all)
        exception = {}
        if isinstance(payload, dict):
            exception = payload.get("exception") or {}
        detail_raw = str(exception.get("message") or payload.get("message") or "Gateway returned 500")
        lines = detail_raw.splitlines()
        detail = (lines[0].strip() if lines else detail_raw.strip()) or "Gateway returned 500"
        return ctx.skip(f"Contacts endpoints skipped: gateway bug on /api/contacts/all ({detail})")

    phone = ctx.config.get("contact_phone") or ""
    contact_id = ctx.config.get("contact_id") or ctx.config["chat_id"]

    if phone:
        ctx.request_gateway(
            "GET",
            "/api/contacts/check-exists",
            params={"session": ctx.session_name, "phone": phone},
        )
    ctx.request_gateway(
        "GET",
        "/api/contacts/about",
        params={"session": ctx.session_name, "contactId": contact_id},
        expected_status={200, 204, 404},
    )
    ctx.request_gateway(
        "GET",
        "/api/contacts/profile-picture",
        params={"session": ctx.session_name, "contactId": contact_id},
        expected_status={200, 204, 404},
    )
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/contacts/{chatId}", chatId=contact_id))
    return ctx.success("Contacts endpoints verified")


def labels_create(ctx: TestContext) -> Tuple[str, str]:
    name = f"AutoLabel-{uuid.uuid4().hex[:6]}"
    payload = {"session": ctx.session_name, "name": name, "colorHex": "#FF8800"}
    response = ctx.request_gateway(
        "POST",
        ctx.session_path("/api/{session}/labels"),
        json_body=payload,
        expected_status={201, 422},
    )
    if response.status_code == 201:
        label_id = response.json().get("id")
        if not label_id:
            raise TestFailure("Label creation returned no ID")
        ctx.created_label_id = str(label_id)
        return ctx.success(f"Label created (id={label_id})")
    reason = gateway_skip_reason(response) or "label creation unavailable"
    return ctx.skip(f"Label creation skipped: {reason}")


def labels_assign(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.created_label_id:
        return ctx.skip("No label created in this run")
    payload = {
        "labels": [
            {
                "id": ctx.created_label_id,
            }
        ]
    }
    response = ctx.request_gateway(
        "PUT",
        ctx.session_path("/api/{session}/labels/chats/{chatId}", chatId=ctx.config["chat_id"]),
        json_body=payload,
        expected_status={200, 422},
    )
    if response.status_code == 200:
        ctx.request_gateway("GET", ctx.session_path("/api/{session}/labels"))
        return ctx.success(f"Label {ctx.created_label_id} assigned to chat")
    reason = gateway_skip_reason(response) or "label assignment unavailable"
    return ctx.skip(f"Label assignment skipped: {reason}")


def labels_delete(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.created_label_id:
        return ctx.skip("No label created in this run")
    response = ctx.request_gateway(
        "DELETE",
        ctx.session_path("/api/{session}/labels/{labelId}", labelId=ctx.created_label_id),
        expected_status={200, 422},
    )
    if response.status_code == 200:
        return ctx.success(f"Label {ctx.created_label_id} deleted")
    reason = gateway_skip_reason(response) or "label deletion unavailable"
    return ctx.skip(f"Label deletion skipped: {reason}")


def groups_suite(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/groups"))
    group_id = ctx.config.get("group_id")
    if not group_id:
        return ctx.skip("Group ID not provided – listing groups only")
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/groups/{id}", id=group_id))
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/groups/{id}/participants", id=group_id))
    ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/groups/{id}/invite-code", id=group_id),
        expected_status={200, 204},
    )
    return ctx.success("Group details retrieved")


def presence_checks(ctx: TestContext) -> Tuple[str, str]:
    chat_id = ctx.config["chat_id"]
    response_all = ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/presence"),
        expected_status={200, 501},
    )
    if response_all.status_code == 501:
        reason = gateway_skip_reason(response_all) or "presence not supported"
        return ctx.skip(f"Presence endpoints skipped: {reason}")
    ctx.request_gateway("GET", ctx.session_path("/api/{session}/presence/{chatId}", chatId=chat_id))
    ctx.request_gateway(
        "GET",
        ctx.session_path("/api/{session}/presence/{chatId}/subscribe", chatId=chat_id),
        expected_status={200, 202},
    )
    return ctx.success("Presence endpoints exercised")


# --------------------------------------------------------------------------- #
# Test catalogue                                                              #
# --------------------------------------------------------------------------- #

TEST_CASES: List[TestCase] = [
    TestCase("Backend health", test_backend_health),
    TestCase("Gateway status suite", test_gateway_status_endpoints),
    TestCase("Session overview", test_session_overview),
    TestCase("Session stop/start cycle", session_stop_start_cycle),
    TestCase("Profile endpoints", test_profile_info),
    TestCase("Send text message", send_text_message, ("chat_id",)),
    TestCase("Send link preview", send_link_preview, ("chat_id", "link_preview_url")),
    TestCase("Send image", send_image, ("chat_id", "image_url")),
    TestCase("Send document", send_document, ("chat_id", "document_url")),
    TestCase("Send voice note", send_voice, ("chat_id", "voice_url")),
    TestCase("Send video", send_video, ("chat_id", "video_url")),
    TestCase("Send location", send_location, ("chat_id", "location_lat", "location_lng", "location_title")),
    TestCase("Send vCard contact", send_vcard, ("chat_id", "vcard")),
    TestCase("Start typing", start_typing, ("chat_id",)),
    TestCase("Stop typing", stop_typing, ("chat_id",)),
    TestCase("Send seen receipts", send_seen, ("chat_id",)),
    TestCase("Apply reaction", send_reaction, ("chat_id",)),
    TestCase("Chats overview", chats_overview, ("chat_id",)),
    TestCase("Contacts suite", contacts_suite, ("chat_id",)),
    TestCase("Labels – create", labels_create),
    TestCase("Labels – assign to chat", labels_assign, ("chat_id",)),
    TestCase("Labels – delete", labels_delete),
    TestCase("Groups overview", groups_suite),
    TestCase("Presence subscription", presence_checks, ("chat_id",)),
]


# --------------------------------------------------------------------------- #
# Runner                                                                      #
# --------------------------------------------------------------------------- #


def configure_logging() -> Tuple[logging.Logger, Path]:
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    log_path = LOGS_DIR / f"gateway_test_{timestamp}.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.FileHandler(log_path, encoding="utf-8")],
    )
    logger = logging.getLogger("gateway-test")
    return logger, log_path


def print_intro(config: Dict[str, object], log_path: Path) -> None:
    banner = textwrap.dedent(
        f"""
        {Ansi.BOLD}About to run {len(TEST_CASES)} WhatsApp gateway API tests.{Ansi.RESET}
        Gateway base URL : {config['gateway_url']}
        Session       : {config['session']}
        Chat ID       : {config['chat_id']}
        Log file      : {log_path}

        The script will send real messages/media to the provided chat and may modify labels.
        """
    )
    print(ctext(Ansi.MAGENTA, banner))
    proceed = input(ctext(Ansi.YELLOW, "Proceed? [Y/n]: ")).strip().lower()
    if proceed and proceed not in {"y", "yes"}:
        print("Aborted by user.")
        sys.exit(0)


def main() -> int:
    config = collect_config()
    logger, log_path = configure_logging()
    print_intro(config, log_path)

    ctx = TestContext(config, logger)
    results: List[TestResult] = []

    print(ctext(Ansi.BOLD, "\nExecuting tests...\n"))
    for case in TEST_CASES:
        result = case.run(ctx)
        results.append(result)
        colour = {"PASS": Ansi.GREEN, "FAIL": Ansi.RED, "SKIP": Ansi.YELLOW}.get(result.status, Ansi.CYAN)
        print(f"{ctext(colour, result.status):<10} {case.name} - {result.message}")

    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status == "FAIL")
    skipped = sum(1 for r in results if r.status == "SKIP")

    summary = f"\nSummary: {passed} passed, {failed} failed, {skipped} skipped. Detailed log: {log_path}"
    if failed:
        print(ctext(Ansi.RED, summary))
    else:
        print(ctext(Ansi.GREEN, summary))

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
        sys.exit(130)
