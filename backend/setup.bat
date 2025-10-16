@echo off
REM ============================================
REM Quick Setup Script for Backend (Windows)
REM ============================================

echo.
echo ========================================
echo   Backend Setup Script
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed!
    echo [!] Please download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo [OK] NPM version:
npm -v
echo.

REM Install dependencies
echo [*] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Check .env file
if not exist .env (
    echo [!] .env file not found
    echo [*] Copying from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo [!] Please edit .env file with your configuration
    echo.
) else (
    echo [OK] .env file exists
    echo.
)

REM Ask for database reset
echo.
set /p RESET="Do you want to reset and seed database? (y/n): "
if /i "%RESET%"=="y" (
    echo [*] Resetting database...
    call npx prisma migrate reset --force
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Database reset successfully
    ) else (
        echo [X] Database reset failed
        echo [!] Make sure MongoDB is running
    )
) else (
    echo [*] Skipped database reset
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Edit .env file with your configuration
echo   2. Make sure MongoDB is running
echo   3. Run: npm run dev
echo.
echo Happy Coding!
echo.
pause
