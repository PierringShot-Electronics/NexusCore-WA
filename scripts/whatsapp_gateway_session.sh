#!/usr/bin/env bash
# Automatik WhatsApp gateway sessiyası yaradılması və işə salınması

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a
  source .env
  set +a
fi

SESSION_ID="${WHATSAPP_GATEWAY_SESSION:-default}"
SERVER_PORT="${WHATSAPP_GATEWAY_PORT:-3001}"
HOST_URL="${WHATSAPP_GATEWAY_HOST_URL:-http://localhost:${SERVER_PORT}}"
WEBHOOK_URL="${WHATSAPP_GATEWAY_WEBHOOK_URL:-http://app:3000/webhook}"
EVENTS_JSON='["message.any","message.ack"]'

if ! command -v curl >/dev/null 2>&1; then
  echo "[gateway_session] curl tapılmadı. Skript davam edə bilmir."
  exit 1
fi

gateway_request() {
  local method="$1"
  local url="$2"
  shift 2 || true

  curl -sS \
    -H "Content-Type: application/json" \
    -X "${method}" "${url}" "$@"
}

session_exists() {
  gateway_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}" >/dev/null 2>&1
}

echo "[gateway_session] Sessiya ID: ${SESSION_ID}"
echo "[gateway_session] Gateway API URL: ${HOST_URL}"

if session_exists; then
  echo "[gateway_session] Sessiya artıq mövcuddur, yaradılmasını ötürürəm."
else
  echo "[gateway_session] Sessiya yaradılması təşəbbüsü..."
  payload=$(cat <<JSON
{
  "id": "${SESSION_ID}",
  "webhooks": [
    {
      "url": "${WEBHOOK_URL}",
      "events": ${EVENTS_JSON}
    }
  ]
}
JSON
)
  if gateway_request "POST" "${HOST_URL}/api/sessions" -d "${payload}" >/dev/null 2>&1; then
    echo "[gateway_session] Sessiya yaradıldı."
  else
    echo "[gateway_session] Sessiya yaradılmadı (endpoint mövcud olmaya bilər). Mövcud sessiya ilə davam edilir."
  fi
fi

echo "[gateway_session] Sessiya işə salınır..."
gateway_request "POST" "${HOST_URL}/api/sessions/${SESSION_ID}/start" >/dev/null || true

echo "[gateway_session] Nəticə: sessiya statusu:"
gateway_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}" | jq '.' 2>/dev/null || gateway_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}"

echo "[gateway_session] QR kodu alınır..."
qr_response="$(gateway_request "GET" "${HOST_URL}/api/${SESSION_ID}/auth/qr")"

if command -v jq >/dev/null 2>&1; then
  qr_value=$(printf '%s' "${qr_response}" | jq -r '.qr // empty')
else
  qr_value="$(printf '%s' "${qr_response}" | python3 - <<'PY' || true
import json,sys
try:
    data=json.load(sys.stdin)
    print(data.get("qr") or "")
except Exception:
    pass
PY
)"
fi

if [ -n "${qr_value}" ]; then
  tmp_png="$(mktemp /tmp/gateway-qr-XXXXXX.png)"
  sanitized="${qr_value#data:image/png;base64,}"
  if command -v base64 >/dev/null 2>&1; then
    printf '%s' "${sanitized}" | base64 -d >"${tmp_png}" 2>/dev/null || true
  fi

  echo "[gateway_session] QR məlumatı:"
  printf '%s\n' "${qr_value}"
  if [ -s "${tmp_png}" ]; then
    echo "[gateway_session] QR kodu PNG kimi saxlandı: ${tmp_png}"
    echo "                  Telefonla WhatsApp → Linked Devices → Link a Device açın və bu faylı skan edin."
  else
    rm -f "${tmp_png}"
    echo "[gateway_session] QR kodu mətn formatında verildi. Gateway loqlarını və ya yuxarıdakı JSON-u istifadə edin."
  fi
else
  echo "[gateway_session] QR cavabı:"
  printf '%s\n' "${qr_response}"
  echo "[gateway_session] QR data sahəsi tapılmadı. Sessiya artıq bağlı ola bilər."
fi

echo "[gateway_session] Hazırdır. Sessiya statusunu yoxlamaq üçün:"
echo "  curl ${HOST_URL}/api/sessions/${SESSION_ID}"
