@echo off

echo ===============================
echo Docker NestJS Starter Kit
echo ===============================

REM Hanya membersihkan project INI (tidak menyentuh project Docker lain)
docker compose down --remove-orphans

REM Validasi docker-compose.yml + .env (berhenti jika ada error)
docker compose config -q
if errorlevel 1 (
    echo.
    echo [ERROR] docker-compose.yml / .env tidak valid.
    pause
    exit /b 1
)

docker compose build --no-cache

docker compose up -d

REM Baca port dari .env (default jika tidak ada)
set HOST_APP_PORT=8200
set HOST_PMA_PORT=9192
for /f "usebackq tokens=1,* delims==" %%a in (`findstr /b "HOST_APP_PORT= HOST_PMA_PORT=" .env`) do set %%a=%%b

echo.
echo ====================================
echo Login       : http://localhost:%HOST_APP_PORT%/login
echo Units       : http://localhost:%HOST_APP_PORT%/admin/units
echo Health      : http://localhost:%HOST_APP_PORT%/health
echo phpMyAdmin  : http://localhost:%HOST_PMA_PORT%
echo ====================================
echo.
echo Start pertama butuh beberapa menit (scaffold + npm install).
echo Lihat progres: docker compose logs -f app

pause
