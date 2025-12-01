#!/usr/bin/env python3
"""
NexusCore-WA deep WAHA integration test runner.

This script exercises the public (free-tier) WAHA HTTP API documented in
`docs/openapi.json` to validate message sending, media handling, contacts,
labels, groups, and presence behaviour. It replaces the legacy smoke test
and is intentionally interactive: the very first run collects the required
IDs/URLs from the operator and caches them for subsequent executions.

Key features:
  • Interactive, colourised prompting with cached defaults.
  • Sequential end-to-end checks covering core WAHA endpoints.
  • Automatic logging to `logs/waha_test_<timestamp>.log`.
  • Config persistence in `logs/test_endpoints_config.json`.

Usage (from repo root):
    python scripts/test_endpoints.py

Suppress ANSI colours by exporting NO_COLOR=1.
"""

from __future__ import annotations

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
    ConfigField("waha_url", "WAHA base URL", "http://localhost:3001", True),
    ConfigField("api_key", "WAHA API key", "", True),
    ConfigField("session", "WAHA session name", "default", True),
    ConfigField("chat_id", "Primary chat ID (e.g. 11111111111@c.us)", "", True),
    ConfigField("group_id", "Test group ID (optional, 11111111111-123@g.us)", "", False),
    ConfigField("contact_id", "Contact chat ID for profile/about lookups", "", False),
    ConfigField("contact_phone", "Contact phone (digits only) for exists check", "", False),
    ConfigField(
        "image_url",
        "Image URL for media tests",
        "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg",
        True,
    ),
    ConfigField(
        "video_url",
        "Video URL for media tests",
        "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4",
        True,
    ),
    ConfigField(
        "voice_url",
        "Voice (opus) URL for voice note tests",
        "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus",
        True,
    ),
    ConfigField(
        "document_url",
        "Document URL for file tests",
        "https://github.com/devlikeapro/waha/raw/core/examples/dev-like-a-pro.pdf",
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
    print(ctext(Ansi.MAGENTA, "\nWAHA Endpoint Test Runner – configuration wizard"))
    cached = load_cached_config()
    config: Dict[str, object] = {}
    for field in CONFIG_FIELDS:
        config[field.key] = prompt_with_default(field, cached)

    print(
        ctext(
            Ansi.YELLOW,
            "\nConfiguration saved. Secrets (e.g. API key) are stored locally in logs/test_endpoints_config.json.",
        )
    )
    store_config(config)
    return config


# --------------------------------------------------------------------------- #
# Test framework                                                              #
# --------------------------------------------------------------------------- #


class TestFailure(Exception):
    """Intentional assertion failure within a test."""


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
        self.waha_base = str(config["waha_url"]).rstrip("/")
        self.backend_base = str(config["backend_url"]).rstrip("/")
        self.session_name = str(config["session"])

        self.http = requests.Session()
        self.http.headers.update({"X-Api-Key": str(config["api_key"])})

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

    def request_waha(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, object]] = None,
        json_body: Optional[Dict[str, object]] = None,
        expected_status: Iterable[int] | int = 200,
    ) -> requests.Response:
        url = f"{self.waha_base}{path}"
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
            "WAHA %s %s -> %s (%.1f ms)",
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
# Individual test implementations                                            #
# --------------------------------------------------------------------------- #


def test_backend_health(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_backend("GET", "/healthz")
    ctx.request_backend("GET", "/api/version")
    return ctx.success("Backend health endpoints reachable")


def test_waha_status_endpoints(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", "/health")
    ctx.request_waha("GET", "/ping")
    ctx.request_waha("GET", "/api/server/status")
    ctx.request_waha("GET", "/api/server/version")
    return ctx.success("WAHA health, ping, status and version endpoints responded")


def test_session_overview(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", "/api/sessions")
    ctx.request_waha("GET", f"/api/sessions/{ctx.session_name}")
    ctx.request_waha("GET", f"/api/sessions/{ctx.session_name}/me")
    return ctx.success(f"Session '{ctx.session_name}' metadata retrieved")


def test_profile_info(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", ctx.session_path("/api/{session}/profile"))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/profile/status"))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/profile/picture"), expected_status={200, 204})
    return ctx.success("Profile information fetched")


def send_text_message(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "text": f"Automated test message at {datetime.utcnow().isoformat()}",
        "linkPreview": False,
    }
    response = ctx.request_waha("POST", "/api/sendText", json_body=payload, expected_status=201)
    data = response.json()
    message_id = data.get("id")
    if message_id:
        ctx.last_message_ids.append(message_id)
        return ctx.success(f"Text message sent (id={message_id})")
    return ctx.success("Text message sent (no id in response)")


def send_link_preview(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "text": f"Preview this link: {ctx.config['link_preview_url']}",
        "linkPreview": True,
    }
    ctx.request_waha("POST", "/api/sendLinkPreview", json_body=payload, expected_status=201)
    return ctx.success("Link preview message sent")


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
    ctx.request_waha("POST", "/api/sendImage", json_body=payload, expected_status=201)
    return ctx.success("Image message sent")


def send_document(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "file": _remote_file(str(ctx.config["document_url"]), "application/pdf"),
    }
    ctx.request_waha("POST", "/api/sendFile", json_body=payload, expected_status=201)
    return ctx.success("Document message sent")


def send_voice(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "convert": True,
        "file": {
            "url": ctx.config["voice_url"],
            "mimetype": "audio/ogg; codecs=opus",
        },
    }
    ctx.request_waha("POST", "/api/sendVoice", json_body=payload, expected_status=201)
    return ctx.success("Voice note sent")


def send_video(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "convert": True,
        "caption": "Video test",
        "file": _remote_file(str(ctx.config["video_url"]), "video/mp4"),
    }
    ctx.request_waha("POST", "/api/sendVideo", json_body=payload, expected_status=201)
    return ctx.success("Video message sent")


def send_location(ctx: TestContext) -> Tuple[str, str]:
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "latitude": float(ctx.config["location_lat"]),
        "longitude": float(ctx.config["location_lng"]),
        "title": ctx.config["location_title"],
    }
    ctx.request_waha("POST", "/api/sendLocation", json_body=payload, expected_status=201)
    return ctx.success("Location message sent")


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
    ctx.request_waha("POST", "/api/sendContactVcard", json_body=payload, expected_status=201)
    return ctx.success("Contact vCard message sent")


def start_typing(ctx: TestContext) -> Tuple[str, str]:
    payload = {"session": ctx.session_name, "chatId": ctx.config["chat_id"]}
    ctx.request_waha("POST", "/api/startTyping", json_body=payload, expected_status=200)
    return ctx.success("Typing indicator started")


def stop_typing(ctx: TestContext) -> Tuple[str, str]:
    payload = {"session": ctx.session_name, "chatId": ctx.config["chat_id"]}
    ctx.request_waha("POST", "/api/stopTyping", json_body=payload, expected_status=200)
    return ctx.success("Typing indicator stopped")


def send_seen(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.last_message_ids:
        return ctx.skip("No message ids available for seen receipt")
    payload = {
        "session": ctx.session_name,
        "chatId": ctx.config["chat_id"],
        "messageIds": ctx.last_message_ids[-3:],
    }
    ctx.request_waha("POST", "/api/sendSeen", json_body=payload, expected_status=201)
    return ctx.success("Seen markers sent")


def send_reaction(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.last_message_ids:
        return ctx.skip("No message ids available for reaction")
    payload = {
        "session": ctx.session_name,
        "messageId": ctx.last_message_ids[-1],
        "reaction": "👍",
    }
    ctx.request_waha("PUT", "/api/reaction", json_body=payload, expected_status=200)
    return ctx.success("Reaction applied to last message")


def chats_overview(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", ctx.session_path("/api/{session}/chats"))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/chats/overview"))
    chat_id = ctx.config["chat_id"]
    ctx.request_waha("GET", ctx.session_path("/api/{session}/chats/{chatId}", chatId=chat_id))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/chats/{chatId}/messages", chatId=chat_id))
    return ctx.success("Chat overview and history fetched")


def contacts_suite(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", "/api/contacts")
    ctx.request_waha("GET", "/api/contacts/all")
    phone = ctx.config.get("contact_phone") or ""
    contact_id = ctx.config.get("contact_id") or ctx.config["chat_id"]

    if phone:
        ctx.request_waha(
            "GET",
            "/api/contacts/check-exists",
            params={"session": ctx.session_name, "phone": phone},
        )
    ctx.request_waha(
        "GET",
        "/api/contacts/about",
        params={"session": ctx.session_name, "contactId": contact_id},
        expected_status={200, 204},
    )
    ctx.request_waha(
        "GET",
        "/api/contacts/profile-picture",
        params={"session": ctx.session_name, "contactId": contact_id},
        expected_status={200, 204},
    )
    ctx.request_waha("GET", ctx.session_path("/api/{session}/contacts/{chatId}", chatId=contact_id))
    return ctx.success("Contacts endpoints verified")


def labels_create(ctx: TestContext) -> Tuple[str, str]:
    name = f"AutoLabel-{uuid.uuid4().hex[:6]}"
    payload = {"session": ctx.session_name, "name": name}
    response = ctx.request_waha(
        "POST", ctx.session_path("/api/{session}/labels"), json_body=payload, expected_status=201
    )
    label_id = response.json().get("id")
    if not label_id:
        raise TestFailure("Label creation returned no ID")
    ctx.created_label_id = str(label_id)
    return ctx.success(f"Label created (id={label_id})")


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
    ctx.request_waha(
        "PUT",
        ctx.session_path("/api/{session}/labels/chats/{chatId}", chatId=ctx.config["chat_id"]),
        json_body=payload,
        expected_status=200,
    )
    ctx.request_waha("GET", ctx.session_path("/api/{session}/labels"))
    return ctx.success(f"Label {ctx.created_label_id} assigned to chat")


def labels_delete(ctx: TestContext) -> Tuple[str, str]:
    if not ctx.created_label_id:
        return ctx.skip("No label created in this run")
    ctx.request_waha(
        "DELETE",
        ctx.session_path("/api/{session}/labels/{labelId}", labelId=ctx.created_label_id),
        expected_status=200,
    )
    return ctx.success(f"Label {ctx.created_label_id} deleted")


def groups_suite(ctx: TestContext) -> Tuple[str, str]:
    ctx.request_waha("GET", ctx.session_path("/api/{session}/groups"))
    group_id = ctx.config.get("group_id")
    if not group_id:
        return ctx.skip("Group ID not provided – listing groups only")
    ctx.request_waha("GET", ctx.session_path("/api/{session}/groups/{id}", id=group_id))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/groups/{id}/participants", id=group_id))
    ctx.request_waha(
        "GET",
        ctx.session_path("/api/{session}/groups/{id}/invite-code", id=group_id),
        expected_status={200, 204},
    )
    return ctx.success("Group details retrieved")


def presence_checks(ctx: TestContext) -> Tuple[str, str]:
    chat_id = ctx.config["chat_id"]
    ctx.request_waha("GET", ctx.session_path("/api/{session}/presence"))
    ctx.request_waha("GET", ctx.session_path("/api/{session}/presence/{chatId}", chatId=chat_id))
    ctx.request_waha(
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
    TestCase("WAHA status suite", test_waha_status_endpoints),
    TestCase("Session overview", test_session_overview),
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
    log_path = LOGS_DIR / f"waha_test_{timestamp}.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.FileHandler(log_path, encoding="utf-8")],
    )
    logger = logging.getLogger("waha-test")
    return logger, log_path


def print_intro(config: Dict[str, object], log_path: Path) -> None:
    banner = textwrap.dedent(
        f"""
        {Ansi.BOLD}About to run {len(TEST_CASES)} WAHA API tests.{Ansi.RESET}
        WAHA base URL : {config['waha_url']}
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
