#!/bin/bash

set -e

# ==========================================================
# CONFIGURATION
# ==========================================================

APP_DIR="/app"
TEMPLATE_DIR="/opt/template"

# Nama package npm (bisa diubah lewat NEST_PROJECT_NAME di .env)
NEST_PROJECT_NAME="${NEST_PROJECT_NAME:-nest-api}"

# Nama package yang tertulis di template/package.json.
TEMPLATE_NAME="nest-mvc-template"

cd "$APP_DIR"


# ==========================================================
# INIT PROJECT DARI TEMPLATE (NESTJS + TYPEORM + MVC)
# ==========================================================
# Indikator project: package.json
#
# Belum ada package.json -> salin struktur MVC dari /opt/template
#                           ke src/, lalu npm install.
# Sudah ada package.json -> project Anda TIDAK ditimpa.
# ==========================================================

if [ ! -f "package.json" ]; then

    echo "======================================"
    echo " Creating new NestJS (MVC) project..."
    echo "======================================"

    if [ ! -d "$TEMPLATE_DIR" ]; then
        echo "ERROR: template tidak ditemukan di $TEMPLATE_DIR"
        echo "Build ulang image: docker compose up -d --build"
        exit 1
    fi

    # Salin template ke folder sementara, ganti nama package,
    # baru salin ke src/.
    TMP_DIR="$(mktemp -d)"
    cp -a "$TEMPLATE_DIR"/. "$TMP_DIR"/

    if [ "$NEST_PROJECT_NAME" != "$TEMPLATE_NAME" ]; then
        sed -i "s#\"name\": \"${TEMPLATE_NAME}\"#\"name\": \"${NEST_PROJECT_NAME}\"#" \
            "$TMP_DIR/package.json"
    fi

    # -n : file yang SUDAH ada di src/ tidak ditimpa
    cp -an "$TMP_DIR"/. "$APP_DIR"/
    rm -rf "$TMP_DIR"

    echo "NestJS (MVC) project created."

else

    echo "======================================"
    echo " Existing NestJS project detected."
    echo "======================================"

fi

# node_modules ada di volume Docker; cepat jika sudah up-to-date
npm install --no-audit --no-fund

mkdir -p tmp


# ==========================================================
# INFORMATION
# ==========================================================

GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}🚀 NestJS MVC Docker Starter Kit${NC}"
echo -e "${GREEN}============================================================${NC}"

echo ""

echo -e "${BLUE}Login       :${NC} http://localhost:${HOST_APP_PORT:-8200}/login"
echo -e "${BLUE}Units page  :${NC} http://localhost:${HOST_APP_PORT:-8200}/admin/units"
echo -e "${BLUE}Health      :${NC} http://localhost:${HOST_APP_PORT:-8200}/health"
echo -e "${BLUE}phpMyAdmin  :${NC} http://localhost:${HOST_PMA_PORT:-9192}"

echo ""

echo -e "${YELLOW}MySQL${NC}"
echo "Host       : ${DB_HOST:-kazuya-mysql}"
echo "Port       : ${DB_PORT:-3306} (host: ${HOST_DB_PORT:-3109})"
echo "Database   : ${DB_DATABASE}"
echo "Username   : ${DB_USERNAME}"

echo ""

echo -e "${GREEN}Ready for Development 🚀${NC}"

echo ""


# ==========================================================
# START (npm run start:dev / perintah dari CMD)
# ==========================================================

echo "Starting: $*"

exec "$@"
