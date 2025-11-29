#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "[start_clean] Docker tapılmadı. Zəhmət olmasa Docker quraşdırın."
  exit 1
fi

if ! command -v docker compose >/dev/null 2>&1; then
  echo "[start_clean] Docker Compose v2 tələb olunur (docker compose)."
  exit 1
fi

if [ -f "$REPO_ROOT/.env" ]; then
  echo "[start_clean] .env faylı tapıldı, port dəyişənləri yüklənir."
  # shellcheck disable=SC1090
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

if [[ -z "${WAHA_API_KEY:-}" || "${WAHA_API_KEY}" == "admin" || "${WAHA_API_KEY}" == "changeme" ]]; then
  echo "[start_clean][XƏTA] WAHA_API_KEY .env faylında güclü dəyərlə təyin edilməlidir."
  exit 1
fi

for required_var in WAHA_DASHBOARD_USERNAME WAHA_DASHBOARD_PASSWORD WHATSAPP_SWAGGER_USERNAME WHATSAPP_SWAGGER_PASSWORD; do
  if [[ -z "${!required_var:-}" ]]; then
    echo "[start_clean][XƏTA] ${required_var} üçün dəyər təyin edilməyib. .env faylını yeniləyin."
    exit 1
  fi
done

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
POSTGRES_PORT="$(resolve_port POSTGRES_PORT 5432)"
REDIS_PORT="$(resolve_port REDIS_PORT 6379)"

free_port() {
  local port="$1"
  local label="$2"

  if ! command -v lsof >/dev/null 2>&1; then
    echo "[start_clean] lsof quraşdırılmayıb, port yoxlamaq mümkün deyil."
    return
  fi

  while lsof -ti "tcp:${port}" >/dev/null 2>&1; do
    local pids
    pids="$(lsof -ti "tcp:${port}")"
    echo "[start_clean] Port ${port} (${label}) istifadə olunur. PIDs: ${pids}"

    # Specific handling for common services
    if [[ "${port}" == "${POSTGRES_PORT}" ]] && command -v systemctl >/dev/null 2>&1; then
      if systemctl is-active --quiet postgresql; then
        echo "[start_clean] Sistem Postgres servisini dayandırır..."
        sudo systemctl stop postgresql || true
      fi
    fi

    for pid in ${pids}; do
      if ps -p "${pid}" >/dev/null 2>&1; then
        echo "[start_clean] PID ${pid} üçün SIGTERM göndərilir."
        kill "${pid}" || true
      fi
    done

    sleep 1

    if lsof -ti "tcp:${port}" >/dev/null 2>&1; then
      echo "[start_clean] Port ${port} hələ də məşğuldur, SIGKILL tətbiq olunur."
      for pid in $(lsof -ti "tcp:${port}"); do
        kill -9 "${pid}" || true
      done
      sleep 1
      if lsof -ti "tcp:${port}" >/dev/null 2>&1; then
        echo "[start_clean][XƏTA] Port ${port} sərbəst buraxılmadı. Manual müdaxilə tələb olunur."
        exit 1
      fi
    fi
  done

  echo "[start_clean] Port ${port} (${label}) boşdur."
}

echo "[start_clean] Mövcud Docker konteynerləri dayandırılır..."
docker compose down --remove-orphans >/dev/null 2>&1 || true

free_port "${POSTGRES_PORT}" "Postgres"
free_port "${REDIS_PORT}" "Redis"
free_port "${WAHA_PORT}" "WAHA"
free_port "${APP_PORT}" "Backend"
free_port "${DASHBOARD_PORT}" "Dashboard"

echo "[start_clean] Docker imicləri yenidən qurulur..."
docker compose build

echo "[start_clean] Servislər ayağa qaldırılır..."
docker compose up --build
