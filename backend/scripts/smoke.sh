#!/usr/bin/env bash
#
# End-to-end smoke test: boots uvicorn against a throwaway SQLite database and
# exercises the real HTTP surface (no in-process shortcuts).
#
# Usage: ./scripts/smoke.sh
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${SMOKE_PORT:-8123}"
BASE="http://127.0.0.1:${PORT}"
TMP_DIR="$(mktemp -d)"
DB_FILE="${TMP_DIR}/smoke.db"
LOG_FILE="${TMP_DIR}/server.log"

export THERAVIVA_DATABASE_URL="sqlite+aiosqlite:///${DB_FILE}"
export THERAVIVA_AUTO_CREATE_TABLES=true
export THERAVIVA_ENV=development
export THERAVIVA_ADMIN_EMAIL=admin@theraviva.local
export THERAVIVA_ADMIN_PASSWORD=admin12345

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "▶ starting uvicorn on port ${PORT}"
uv run uvicorn app.main:app --host 127.0.0.1 --port "${PORT}" --log-level warning >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!

# Wait for readiness.
for _ in $(seq 1 50); do
  if curl -fsS "${BASE}/healthz" >/dev/null 2>&1; then break; fi
  sleep 0.2
done

fail() { echo "✖ $1"; echo "--- server log ---"; cat "${LOG_FILE}"; exit 1; }
pass() { echo "✔ $1"; }

check_status() {
  local expected="$1" method="$2" url="$3" data="${4:-}" auth="${5:-}"
  local args=(-sS -o /dev/null -w '%{http_code}' -X "${method}" "${url}")
  [[ -n "${data}" ]] && args+=(-H 'Content-Type: application/json' -d "${data}")
  [[ -n "${auth}" ]] && args+=(-H "Authorization: Bearer ${auth}")
  local status
  status="$(curl "${args[@]}")"
  [[ "${status}" == "${expected}" ]] || fail "${method} ${url} → ${status} (expected ${expected})"
  pass "${method} ${url} → ${status}"
}

check_status 200 GET "${BASE}/healthz"
check_status 200 GET "${BASE}/readyz"
check_status 200 GET "${BASE}/version"
check_status 200 GET "${BASE}/metrics"
check_status 200 GET "${BASE}/api/v1/services"

# Public appointment request.
REQUEST_BODY='{"mode":"video","serviceSlug":"occupational-therapy-assessment","professionalId":"md-irfan","preferredDate":"","preferredTime":"morning","fullName":"Smoke Parent","phone":"9876500000","email":"smoke@example.com","patientName":"Smoke Child","notes":"","consent":true}'
check_status 201 POST "${BASE}/api/v1/intake/appointment-requests" "${REQUEST_BODY}"

# Admin login → dashboard.
LOGIN="$(curl -sS -X POST "${BASE}/api/v1/auth/staff/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@theraviva.local","password":"admin12345"}')"
TOKEN="$(printf '%s' "${LOGIN}" | python3 -c 'import sys,json; print(json.load(sys.stdin)["accessToken"])')"
[[ -n "${TOKEN}" ]] || fail "admin login did not return an access token"
pass "POST /api/v1/auth/staff/login → token"

check_status 200 GET "${BASE}/api/v1/dashboard/admin" "" "${TOKEN}"
check_status 200 GET "${BASE}/api/v1/admin/intake/appointment-requests" "" "${TOKEN}"
check_status 401 GET "${BASE}/api/v1/dashboard/admin"

echo
echo "✅ smoke test passed"
