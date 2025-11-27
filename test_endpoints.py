#!/usr/bin/env python3
"""
Basic smoke tests for NexusCore-WA services.

Usage:
    BACKEND_URL=http://localhost:3000 WAHA_URL=http://localhost:3001 python test_endpoints.py
"""

from __future__ import annotations
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Dict, Tuple

import requests


def load_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        return {}

    env_vars: Dict[str, str] = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        env_vars[key.strip()] = value.strip().strip('"').strip("'")
    return env_vars


def check_endpoint(name: str, url: str, headers: Dict[str, str] | None = None) -> Tuple[bool, str]:
    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        return True, f"{name} OK ({response.status_code})"
    except Exception as exc:  # noqa: BLE001 - report all failures
        return False, f"{name} FAIL ({exc})"


def main() -> int:
    repo_root = Path(__file__).resolve().parent
    env_file = repo_root / ".env"
    env_from_file = load_env_file(env_file)

    app_port = os.environ.get("APP_PORT") or env_from_file.get("APP_PORT") or "3000"
    backend_url = os.environ.get("BACKEND_URL") or f"http://localhost:{app_port}"

    waha_host_url = os.environ.get("WAHA_URL") or env_from_file.get("WAHA_HOST_URL")
    waha_port = os.environ.get("WAHA_SERVER_PORT") or env_from_file.get("WAHA_SERVER_PORT") or "3001"
    waha_host = waha_host_url or f"http://localhost:{waha_port}"

    waha_api_key = os.environ.get("WAHA_API_KEY") or env_from_file.get("WAHA_API_KEY")
    if not waha_api_key or waha_api_key in {"admin", "changeme"}:
        print(
            "WAHA_API_KEY is missing or still set to a default value. "
            "Populate it in your environment or .env before running the smoke test.",
            file=sys.stderr,
        )
        return 1

    tasks = [
        ("Backend /healthz", f"{backend_url.rstrip('/')}/healthz", None),
        ("WAHA /api/server/status", f"{waha_host.rstrip('/')}/api/server/status", {"X-Api-Key": waha_api_key}),
    ]

    all_ok = True
    for name, url, headers in tasks:
        status, message = check_endpoint(name, url, headers=headers)
        print(message)
        all_ok = all_ok and status

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
