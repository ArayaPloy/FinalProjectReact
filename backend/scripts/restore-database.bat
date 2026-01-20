@echo off
REM ========================================
REM Restore MySQL Database Script (Windows)
REM ========================================

REM กำหนดค่าตัวแปร
set DB_NAME=eduweb_project
set DB_USER=root
set DB_PASSWORD=
set DB_HOST=localhost
set DB_PORT=3308
set BACKUP_DIR=../backups

echo ========================================
echo Available Backup Files:
echo ========================================
echo.
dir /B /O-D "%BACKUP_DIR%\backup_*.sql" 2>nul
echo.
echo ========================================

set /p BACKUP_FILE="Enter backup filename (or full path): "

REM ตรวจสอบว่าเป็น full path หรือไม่
if not exist "%BACKUP_FILE%" (
    set BACKUP_FILE=%BACKUP_DIR%\%BACKUP_FILE%
)

if not exist "%BACKUP_FILE%" (
    echo.
    echo ❌ Backup file not found: %BACKUP_FILE%
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Database Restore...
echo Database: %DB_NAME%
echo Backup File: %BACKUP_FILE%
echo ========================================
echo.

REM ยืนยันก่อน restore
set /p CONFIRM="⚠️  This will REPLACE all data in '%DB_NAME%'. Continue? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo ❌ Restore cancelled by user.
    pause
    exit /b 0
)

echo.
echo 🔄 Restoring database...

REM Drop database ถ้ามีอยู่แล้ว
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -e "DROP DATABASE IF EXISTS %DB_NAME%;" 2>nul

REM สร้าง database ใหม่
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul

REM Restore data
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% %DB_NAME% < "%BACKUP_FILE%" 2>&1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database restored successfully!
    echo.
) else (
    echo.
    echo ❌ Restore failed! Error code: %ERRORLEVEL%
    echo Please check the error messages above.
)

echo ========================================
pause
