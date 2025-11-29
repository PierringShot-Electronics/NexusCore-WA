#!/usr/bin/env bash
# Automatik WAHA sessiya yaradılması və işə salınması

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a
  source .env
  set +a
fi

SESSION_ID="${WAHA_SESSION:-default}"
API_KEY="${WAHA_API_KEY:-admin}"
SERVER_PORT="${WAHA_SERVER_PORT:-3001}"
HOST_URL="${WAHA_HOST_URL:-http://localhost:${SERVER_PORT}}"
WEBHOOK_URL="${WAHA_WEBHOOK_URL:-http://app:3000/webhook}"
EVENTS_JSON='["messages.upsert","messages.status"]'

if ! command -v curl >/dev/null 2>&1; then
  echo "[waha_session] curl tapılmadı. Skript davam edə bilmir."
  exit 1
fi

api_request() {
  local method="$1"
  local url="$2"
  shift 2 || true

  curl -sS \
    -H "X-Api-Key: ${API_KEY}" \
    -H "Content-Type: application/json" \
    -X "${method}" "${url}" "$@"
}

session_exists() {
  api_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}" >/dev/null 2>&1
}

echo "[waha_session] Sessiya ID: ${SESSION_ID}"
echo "[waha_session] WAHA API URL: ${HOST_URL}"

if session_exists; then
  echo "[waha_session] Sessiya artıq mövcuddur, yaradılmasını ötürürəm."
else
  echo "[waha_session] Yeni sessiya yaradılır..."
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
  api_request "POST" "${HOST_URL}/api/sessions" -d "${payload}" >/dev/null
  echo "[waha_session] Sessiya yaradıldı."
fi

echo "[waha_session] Sessiya işə salınır..."
api_request "POST" "${HOST_URL}/api/sessions/${SESSION_ID}/start" >/dev/null || true

echo "[waha_session] Netice: sessiya statusu:"
api_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}" | jq '.' 2>/dev/null || api_request "GET" "${HOST_URL}/api/sessions/${SESSION_ID}"

echo "[waha_session] QR kodu alınır..."
qr_response="$(api_request "GET" "${HOST_URL}/api/${SESSION_ID}/auth/qr")"

if command -v jq >/dev/null 2>&1; then
  qr_value=$(printf '%s' "${qr_response}" | jq -r '.qr // .data // .qrCode // empty')
else
  qr_value="$(printf '%s' "${qr_response}" | python3 - <<'PY' || true
import json,sys
try:
    data=json.load(sys.stdin)
    print(data.get("qr") or data.get("data") or data.get("qrCode") or "")
except Exception:
    pass
PY
)"
fi

if [ -n "${qr_value}" ]; then
  tmp_png="$(mktemp /tmp/waha-qr-XXXXXX.png)"
  if command -v base64 >/dev/null 2>&1; then
    printf '%s' "${qr_value}" | base64 -d >"${tmp_png}" 2>/dev/null || true
  fi

  echo "[waha_session] QR məlumatı:"
  printf '%s\n' "${qr_response}"
  if [ -s "${tmp_png}" ]; then
    echo "[waha_session] QR kodu PNG kimi saxlandı: ${tmp_png}"
    echo "             Telefonla WhatsApp → Linked Devices → Link a Device açın və bu faylı skan edin."
  else
    rm -f "${tmp_png}"
    echo "[waha_session] QR kodu mətn formatında verildi. WAHA dashboard-da və ya yuxarıdakı JSON-dan istifadə edin."
  fi
else
  echo "[waha_session] QR cavabı:"
  printf '%s\n' "${qr_response}"
  echo "[waha_session] QR data sahəsi tapılmadı. Sessiya artıq bağlı ola bilər və ya WAHA dashboard-dan yoxlayın."
fi

echo "[waha_session] Hazırdır. Sessiya statusu üçün:"
echo "  curl -H \"X-Api-Key: ${API_KEY}\" ${HOST_URL}/api/sessions/${SESSION_ID}"
