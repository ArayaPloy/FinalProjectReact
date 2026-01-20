@echo off
setlocal enabledelayedexpansion
REM ========================================
REM Backup MySQL Database Script (Windows)
REM ========================================

REM Configuration
set DB_NAME=eduweb_project
set DB_USER=root
set DB_PASSWORD=
set DB_HOST=localhost
set DB_PORT=3308
set BACKUP_DIR=..\backups

REM Auto-detect MySQL path
set MYSQLDUMP=
if exist "C:\xampp\mysql\bin\mysqldump.exe" set MYSQLDUMP=C:\xampp\mysql\bin\mysqldump.exe
if exist "D:\xampp\mysql\bin\mysqldump.exe" set MYSQLDUMP=D:\xampp\mysql\bin\mysqldump.exe
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" set MYSQLDUMP=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe

REM If not found, try using PATH
if not defined MYSQLDUMP (
    where mysqldump.exe >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set MYSQLDUMP=mysqldump.exe
    )
)

REM Check if mysqldump exists
if not defined MYSQLDUMP (
    echo ========================================
    echo ERROR: mysqldump.exe not found!
    echo ========================================
    echo.
    echo Please make sure MySQL is installed and:
    echo   1. XAMPP is running (check XAMPP Control Panel)
    echo   2. MySQL bin folder is in system PATH
    echo.
    echo Common locations:
    echo   - C:\xampp\mysql\bin\mysqldump.exe
    echo   - D:\xampp\mysql\bin\mysqldump.exe
    echo.
    echo To add to PATH:
    echo   1. Search "Environment Variables" in Windows
    echo   2. Edit System PATH
    echo   3. Add: C:\xampp\mysql\bin
    echo.
    echo ========================================
    pause
    exit /b 1
)

echo Using MySQL at: %MYSQLDUMP%
echo.

REM Create timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set TIMESTAMP=!datetime:~0,8!_!datetime:~8,6!
set BACKUP_FILE=%BACKUP_DIR%\backup_%DB_NAME%_!TIMESTAMP!.sql

REM Create backup directory if not exists
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ========================================
echo Starting Database Backup...
echo Database: %DB_NAME%
echo Timestamp: !TIMESTAMP!
echo ========================================
echo.

REM Backup database
"%MYSQLDUMP%" -h%DB_HOST% -P%DB_PORT% -u%DB_USER% %DB_NAME% > "%BACKUP_FILE%" 2>&1

if !ERRORLEVEL! EQU 0 goto success
goto failure

:success
echo.
echo ========================================
echo Backup completed successfully!
echo ========================================
echo File: %BACKUP_FILE%
echo.

REM Show file size
for %%A in ("%BACKUP_FILE%") do echo Size: %%~zA bytes

REM Clean old backups
echo.
echo Cleaning old backups (keeping last 7 days)...
forfiles /P "%BACKUP_DIR%" /M backup_*.sql /D -7 /C "cmd /c del @path" 2>nul
echo Done.
goto end

:failure
echo.
echo ========================================
echo Backup failed! Error code: !ERRORLEVEL!
echo ========================================
echo Please check:
echo   - MySQL is running (check XAMPP)
echo   - Database name is correct: %DB_NAME%
echo   - Port is correct: %DB_PORT%
echo   - mysqldump command is in PATH
echo.
goto end

:end
echo.
echo ========================================
pause
