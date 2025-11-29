#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="${REPO_ROOT}/logs"
mkdir -p "${LOG_DIR}"
mkdir -p "${REPO_ROOT}/data/waha/sessions"

log() {
  printf '[start_clean] %s\n' "$*" >&2
}

warn() {
  printf '[start_clean][XƏBƏRDARLIQ] %s\n' "$*" >&2
}

fatal() {
  printf '[start_clean][XƏTA] %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fatal "'$1' tapılmadı. Zəhmət olmasa quraşdırın."
  fi
}

require_cmd docker
require_cmd curl
require_cmd python3

if ! docker compose version >/dev/null 2>&1; then
  fatal "Docker Compose v2 tələb olunur (docker compose)."
fi

if [ -f "$REPO_ROOT/.env" ]; then
  log ".env faylı tapıldı, port dəyişənləri yüklənir."
  # shellcheck disable=SC1090
  set -a
  source "$REPO_ROOT/.env"
  set +a
else
  warn ".env faylı tapılmadı, default dəyərlər istifadə olunacaq."
fi

if [[ -z "${WAHA_API_KEY:-}" || "${WAHA_API_KEY}" == "admin" || "${WAHA_API_KEY}" == "changeme" ]]; then
  fatal "WAHA_API_KEY .env faylında güclü dəyərlə təyin edilməlidir."
fi

for required_var in WAHA_DASHBOARD_USERNAME WAHA_DASHBOARD_PASSWORD WHATSAPP_SWAGGER_USERNAME WHATSAPP_SWAGGER_PASSWORD; do
  if [[ -z "${!required_var:-}" ]]; then
    fatal "${required_var} üçün dəyər təyin edilməyib. .env faylını yeniləyin."
  fi
done

if [[ -z "${WAHA_WEBHOOK_URL:-}" ]]; then
  WAHA_WEBHOOK_URL="http://app:3000/webhook"
  export WAHA_WEBHOOK_URL
  warn "WAHA_WEBHOOK_URL tapılmadı, default http://app:3000/webhook istifadə olunur."
fi

if [[ -z "${WAHA_WEBHOOK_EVENTS:-}" ]]; then
  WAHA_WEBHOOK_EVENTS="message.any"
  export WAHA_WEBHOOK_EVENTS
  warn "WAHA_WEBHOOK_EVENTS tapılmadı, default message.any istifadə olunur."
fi

resolve_port() {
  local var="${1}"
  local default="${2}"
  local value="${!var-}"
  if [[ -z "${value}" ]]; then
    echo "${default}"
  else
    echo "${value}"
  fi
}

APP_PORT="$(resolve_port APP_PORT 3000)"
DASHBOARD_PORT="$(resolve_port DASHBOARD_PORT 3002)"
WAHA_PORT="$(resolve_port WAHA_SERVER_PORT 3001)"
POSTGRES_PORT="$(resolve_port POSTGRES_PORT 55433)"
REDIS_PORT="$(resolve_port REDIS_PORT 6379)"

free_port() {
  local port="$1"
  local label="$2"

  if ! command -v lsof >/dev/null 2>&1; then
    warn "lsof quraşdırılmayıb, port yoxlamaq mümkün deyil."
    return
  fi

  while lsof -ti "tcp:${port}" >/dev/null 2>&1; do
    local pids
    pids="$(lsof -ti "tcp:${port}")"
    log "Port ${port} (${label}) istifadə olunur. PIDs: ${pids}"

    if [[ "${port}" == "${POSTGRES_PORT}" ]] && command -v systemctl >/dev/null 2>&1; then
      if systemctl is-active --quiet postgresql; then
        log "Sistem Postgres servisi dayandırılır..."
        sudo systemctl stop postgresql || true
      fi
    fi

    for pid in ${pids}; do
      if ps -p "${pid}" >/dev/null 2>&1; then
        kill "${pid}" || true
      fi
    done

    sleep 1

    if lsof -ti "tcp:${port}" >/dev/null 2>&1; then
      warn "Port ${port} hələ də məşğuldur, SIGKILL tətbiq olunur."
      for pid in $(lsof -ti "tcp:${port}"); do
        kill -9 "${pid}" || true
      done
      sleep 1
      if lsof -ti "tcp:${port}" >/dev/null 2>&1; then
        fatal "Port ${port} sərbəst buraxılmadı. Manual müdaxilə tələb olunur."
      fi
    fi
  done

  log "Port ${port} (${label}) boşdur."
}

wait_for_http() {
  local label="$1"
  local url="$2"
  shift 2 || true
  local args=("$@")

  for _ in {1..30}; do
    if curl -fsS "${args[@]}" "$url" >/dev/null; then
      log "${label} aktivdir (${url})."
      return 0
    fi
    sleep 2
  done

  fatal "${label} ${url} ünvanında cavab vermir."
}

start_mcp_dev() {
  local flag="${START_MCP_DEV:-true}"
  if [[ "${flag,,}" != "true" ]]; then
    log "MCP dev serveri atlanır (START_MCP_DEV=${flag})."
    return
  fi

  if pgrep -f "src/mcp/server.ts" >/dev/null 2>&1; then
    local pid
    pid="$(pgrep -f "src/mcp/server.ts" | tr '\n' ' ')"
    log "MCP dev server artıq işləyir (PID: ${pid})."
    return
  fi

  log "MCP dev server işə salınır..."
  (cd "${REPO_ROOT}/backend" && nohup npm run mcp:dev > "${LOG_DIR}/mcp-dev.log" 2>&1 &)
  sleep 1
  if pgrep -f "src/mcp/server.ts" >/dev/null 2>&1; then
    log "MCP dev server başladı (loqlar: ${LOG_DIR}/mcp-dev.log)."
  else
    warn "MCP dev server start alınmadı, ${LOG_DIR}/mcp-dev.log faylını yoxlayın."
  fi
}

fetch_session_json() {
  curl -fsS -H "X-Api-Key: ${WAHA_API_KEY}" \
    "${WAHA_HOST_URL:-http://localhost:${WAHA_PORT}}/api/sessions/${WAHA_SESSION:-default}" || true
}

parse_json_field() {
  local json="$1"
  local field="$2"
  python3 - <<'PY' "$json" "$field"
import json, sys
try:
    data = json.loads(sys.argv[1])
    field = sys.argv[2]
    parts = field.split(".")
    for part in parts:
        if isinstance(data, list):
            data = data[0] if data else None
        elif isinstance(data, dict):
            data = data.get(part)
        else:
            data = None
        if data is None:
            break
    if isinstance(data, (dict, list)):
        print(json.dumps(data))
    elif data is None:
        print("")
    else:
        print(data)
except Exception:
    print("")
PY
}

print_qr_code() {
  local qr_file="${LOG_DIR}/waha_qr_$(date +%Y%m%d%H%M%S).png"
  local tmp_headers
  tmp_headers="$(mktemp)"

  if ! curl -sS -D "${tmp_headers}" -H "X-Api-Key: ${WAHA_API_KEY}" \
    "${WAHA_HOST_URL:-http://localhost:${WAHA_PORT}}/api/${WAHA_SESSION:-default}/auth/qr" \
    -o "${qr_file}"; then
    warn "QR kodu əldə etmək mümkün olmadı."
    rm -f "${tmp_headers}" "${qr_file}"
    return 1
  fi

  if ! grep -i "Content-Type: *image/png" "${tmp_headers}" >/dev/null 2>&1; then
    warn "QR cavabı image/png deyil:"
    cat "${qr_file}" >&2 || true
    rm -f "${qr_file}"
    rm -f "${tmp_headers}"
    return 1
  fi
  rm -f "${tmp_headers}"

  log "WAHA QR kodu ${qr_file} faylına yazıldı. Telefonla skan edin."
  log "Base64 (clipboard üçün):"
  python3 - <<'PY' "$qr_file"
import base64, pathlib, sys
path = pathlib.Path(sys.argv[1])
data = path.read_bytes()
print(base64.b64encode(data).decode())
PY
  echo
  log "PNG faylını açmaq üçün: xdg-open \"${qr_file}\""
  return 0
}

ensure_waha_session() {
  local session status me qr_printed=0
  local base_url="${WAHA_HOST_URL:-http://localhost:${WAHA_PORT}}"
  local session_name="${WAHA_SESSION:-default}"

  log "WAHA sessiyası (${session_name}) yoxlanılır..."

  for _ in {1..30}; do
    session="$(fetch_session_json)"
    if [[ -n "${session}" ]]; then
      break
    fi
    sleep 2
  done

  if [[ -z "${session}" ]]; then
    warn "WAHA sessiya məlumatı alınmadı."
    return
  fi

  status="$(parse_json_field "${session}" "status")"
  me="$(parse_json_field "${session}" "me.id")"

  if [[ "${status}" == "WORKING" && -n "${me}" ]]; then
    log "WAHA sessiyası artıq autentifikasiyadan keçib (id: ${me})."
    return
  fi

  log "Sessiyanın cari statusu: ${status:-bilinmir}. Start komandası göndərilir..."
  curl -fsS -X POST -H "X-Api-Key: ${WAHA_API_KEY}" \
    "${base_url}/api/sessions/${session_name}/start" >/dev/null || true

  for _ in {1..60}; do
    session="$(fetch_session_json)"
    status="$(parse_json_field "${session}" "status")"
    me="$(parse_json_field "${session}" "me.id")"

    if [[ "${status}" == "WORKING" && -n "${me}" ]]; then
      log "WAHA sessiyası autentifikasiyadan keçdi (id: ${me})."
      return
    fi

    if [[ "${status}" == "SCAN_QR_CODE" && "${qr_printed}" -eq 0 ]]; then
      log "Sessiya QR skanı gözləyir."
      if print_qr_code; then
        qr_printed=1
        log "Telefonla QR kodunu skan etdikdən sonra bu skript statusu avtomatik izləyir."
      else
        warn "QR kodu əldə etmək mümkün olmadı. WAHA dashboard üzərindən yoxlayın."
        qr_printed=1
      fi
    fi

    sleep 5
  done

  warn "WAHA sessiyası gözlənilən müddətdə WORKING vəziyyətinə keçmədi. Zəhmət olmasa manual olaraq dashboard-u yoxlayın."
}

log "Mövcud Docker konteynerləri dayandırılır..."
docker compose down --remove-orphans >/dev/null 2>&1 || true

free_port "${POSTGRES_PORT}" "Postgres"
free_port "${REDIS_PORT}" "Redis"
free_port "${WAHA_PORT}" "WAHA"
free_port "${APP_PORT}" "Backend"
free_port "${DASHBOARD_PORT}" "Dashboard"

log "Docker imicləri yenidən qurulur..."
docker compose build

log "Servislər ayağa qaldırılır (detached rejim)..."
docker compose up --build -d

BACKEND_URL="${BACKEND_URL:-http://localhost:${APP_PORT}}"
WAHA_URL="${WAHA_HOST_URL:-http://localhost:${WAHA_PORT}}"

wait_for_http "Backend" "${BACKEND_URL}/healthz"
wait_for_http "WAHA" "${WAHA_URL}/api/server/status" -H "X-Api-Key: ${WAHA_API_KEY}"

start_mcp_dev
ensure_waha_session

log "Stack hazırdır."
log "WAHA dashboard: ${WAHA_URL}/dashboard"
log "WAHA Swagger: ${WAHA_URL}/swagger"
log "Backend admin panel: http://localhost:${DASHBOARD_PORT}"
log "MCP endpoint: http://localhost:${MCP_PORT:-3030}/mcp"
docker logs -f nexuscore-wa-waha-1 2>&1 | tee -a "$(pwd)/logs/nexuscore-wa-waha-1.log"
