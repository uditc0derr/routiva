#!/usr/bin/env bash
#
# End-to-end smoke test for the routiva CRUD app.
#
# Starts the server on a throwaway data file, exercises every endpoint with
# curl, prints the results, then shuts the server down. Nothing is left behind.
#
#   ./crud-app/curl.sh

set -euo pipefail

PORT="${PORT:-4123}"
BASE="http://127.0.0.1:${PORT}"
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR="$(mktemp -d)"

export DATA_FILE="${DIR}/products.json"
export PORT
export NODE_ENV=test   # silences the request logger for clean output

node "${HERE}/server.js" >"${DIR}/server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "${SERVER_PID}" 2>/dev/null || true; rm -rf "${DIR}"' EXIT

# Wait for the server to accept connections.
for _ in $(seq 1 100); do
  if curl -fsS "${BASE}/api/health" >/dev/null 2>&1; then break; fi
  sleep 0.1
done

step() { printf '\n\033[1;34m▶ %s\033[0m\n' "$1"; }
json() { curl -sS "$@"; echo; }

step "GET /api/health"
json "${BASE}/api/health"

step "GET /api/products (seeded sample data)"
json "${BASE}/api/products?limit=3"

step "POST /api/products (create)"
CREATED=$(curl -sS -X POST "${BASE}/api/products" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Webcam HD","sku":"CAM-1","price":59.99,"stock":7,"category":"video"}')
echo "${CREATED}"
ID=$(printf '%s' "${CREATED}" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).id))')

step "GET /api/products/${ID}"
json "${BASE}/api/products/${ID}"

step "PATCH /api/products/${ID} (update stock only)"
json -X PATCH "${BASE}/api/products/${ID}" \
  -H 'Content-Type: application/json' -d '{"stock":3}'

step "POST /api/products/${ID}/restock (+20)"
json -X POST "${BASE}/api/products/${ID}/restock" \
  -H 'Content-Type: application/json' -d '{"amount":20}'

step "POST /api/products with invalid body (expect 422)"
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' -X POST "${BASE}/api/products" \
  -H 'Content-Type: application/json' -d '{"name":""}'
json -X POST "${BASE}/api/products" \
  -H 'Content-Type: application/json' -d '{"name":""}'

step "POST /api/products with duplicate SKU (expect 409)"
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' -X POST "${BASE}/api/products" \
  -H 'Content-Type: application/json' -d '{"name":"Dup","sku":"CAM-1","price":1,"stock":1}'

step "POST /api/products/${ID} — wrong method (expect 405 + Allow header)"
curl -sS -i -X POST "${BASE}/api/products/${ID}" \
  -H 'Content-Type: application/json' -d '{}' | sed -n '1,10p'

step "GET /api/products?search=&sort=&order= (query features)"
json "${BASE}/api/products?sort=price&order=desc&limit=3"

step "GET /api/products/abc — invalid id (expect 400)"
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' "${BASE}/api/products/abc"

step "DELETE /api/products/${ID}"
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' -X DELETE "${BASE}/api/products/${ID}"
curl -sS -o /dev/null -w 'GET after delete: HTTP %{http_code}\n' "${BASE}/api/products/${ID}"

step "GET /api/stats"
json "${BASE}/api/stats"

printf '\n\033[1;32m✓ smoke test complete\033[0m\n'
