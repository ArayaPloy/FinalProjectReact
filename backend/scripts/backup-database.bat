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

REM XAMPP MySQL path (change if your XAMPP is in different location)
set MYSQL_BIN=C:\xampp\mysql\bin
set MYSQLDUMP=%MYSQL_BIN%\mysqldump.exe

REM Check if mysqldump exists
if not exist "%MYSQLDUMP%" (
    echo ERROR: mysqldump.exe not found at: %MYSQLDUMP%
    echo.
    echo Please update MYSQL_BIN path in this script to match your XAMPP installation.
    echo Common locations:
    echo   - C:\xampp\mysql\bin
    echo   - D:\xampp\mysql\bin
    echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin
    echo.
    pause
    exit /b 1
)

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
