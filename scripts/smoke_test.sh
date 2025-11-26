#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:3000}"
WAHA_URL="${WAHA_URL:-http://localhost:3001}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-whatscore}"
POSTGRES_DB="${POSTGRES_DB:-whatscore}"

function log() {
  printf '[smoke] %s\n' "$1"
}

log "Checking backend health endpoint..."
curl -fsS "${BACKEND_URL}/healthz" >/dev/null

log "Checking WAHA bridge status..."
curl -fsS "${WAHA_URL}/health" >/dev/null

log "Checking PostgreSQL connectivity..."
PGPASSWORD="${POSTGRES_PASSWORD:-whatscore}" \
  psql "host=${POSTGRES_HOST} port=${POSTGRES_PORT} user=${POSTGRES_USER} dbname=${POSTGRES_DB} sslmode=disable" \
  -c 'SELECT 1;' >/dev/null

log "Smoke tests completed successfully."
