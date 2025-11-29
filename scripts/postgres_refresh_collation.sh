#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

if ! command -v docker >/dev/null 2>&1; then
  echo "[refresh_collation][XƏTA] Docker tələb olunur."
  exit 1
fi

if [ -f ".env" ]; then
  # shellcheck disable=SC1090
  set -a
  source ".env"
  set +a
fi

POSTGRES_USER="${POSTGRES_USER:-nexuscore}"
POSTGRES_DB="${POSTGRES_DB:-nexuscore}"

echo "[refresh_collation] Collation versiyası yenilənir (${POSTGRES_DB})..."
docker compose exec -T postgres \
  psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
  -c "ALTER DATABASE \"${POSTGRES_DB}\" REFRESH COLLATION VERSION;"

echo "[refresh_collation] Tamamlandı."
