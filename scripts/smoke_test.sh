#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env"

if [ -f "${ENV_FILE}" ]; then
  # shellcheck disable=SC1090
  set -a
  source "${ENV_FILE}"
  set +a
fi

BACKEND_URL="${BACKEND_URL:-http://localhost:3000}"
WAHA_URL="${WAHA_URL:-http://localhost:3001}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-whatscore}"
POSTGRES_DB="${POSTGRES_DB:-whatscore}"
WAHA_API_KEY="${WAHA_API_KEY:-}"

if [[ -z "${WAHA_API_KEY}" ]]; then
  echo "[smoke][XƏTA] WAHA_API_KEY tapılmadı. .env faylını yoxlayın."
  exit 1
fi

if [[ "${WAHA_API_KEY}" == "admin" || "${WAHA_API_KEY}" == "changeme" ]]; then
  echo "[smoke][XƏTA] WAHA_API_KEY üçün default dəyərdən istifadə edilir. Güclü açar təyin edin."
  exit 1
fi

function log() {
  printf '[smoke] %s\n' "$1"
}

log "Checking backend health endpoint..."
curl -fsS "${BACKEND_URL}/healthz" >/dev/null

log "Checking WAHA bridge status..."
curl -fsS -H "X-Api-Key: ${WAHA_API_KEY}" "${WAHA_URL}/api/server/status" >/dev/null

log "Checking PostgreSQL connectivity..."
PGPASSWORD="${POSTGRES_PASSWORD:-whatscore}" \
  psql "host=${POSTGRES_HOST} port=${POSTGRES_PORT} user=${POSTGRES_USER} dbname=${POSTGRES_DB} sslmode=disable" \
  -c 'SELECT 1;' >/dev/null

log "Smoke tests completed successfully."
