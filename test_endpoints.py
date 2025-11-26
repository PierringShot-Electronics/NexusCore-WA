#!/usr/bin/env python3
"""
Basic smoke tests for NexusCore-WA services.

Usage:
    BACKEND_URL=http://localhost:3000 WAHA_URL=http://localhost:3001 python test_endpoints.py
"""

from __future__ import annotations

import os
import sys
from typing import Tuple

import requests


def check_endpoint(name: str, url: str) -> Tuple[bool, str]:
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return True, f"{name} OK ({response.status_code})"
    except Exception as exc:  # noqa: BLE001 - surface any failure
        return False, f"{name} FAIL ({exc})"


def main() -> int:
    backend_url = os.environ.get("BACKEND_URL", "http://localhost:3000")
    waha_url = os.environ.get("WAHA_URL", "http://localhost:3001")

    tasks = [
        ("Backend /healthz", f"{backend_url.rstrip('/')}/healthz"),
        ("WAHA /health", f"{waha_url.rstrip('/')}/health"),
    ]

    all_ok = True
    for name, url in tasks:
        status, message = check_endpoint(name, url)
        print(message)
        all_ok = all_ok and status

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
