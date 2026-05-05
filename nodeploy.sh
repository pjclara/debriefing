#!/bin/bash
# nodeploy.sh — Acerta vidas_atual e unidades_atual na tabela stock_movimentos
set -e

LARAVEL_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$LARAVEL_DIR"

echo "==> A corrigir vidas_atual e unidades_atual em stock_movimentos..."

php "${LARAVEL_DIR}/nodeploy.php"

echo "==> DONE"
