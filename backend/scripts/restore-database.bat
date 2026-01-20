@echo off
setlocal enabledelayedexpansion
REM ========================================
REM Restore MySQL Database Script (Windows)
REM ========================================

REM Configuration
set DB_NAME=eduweb_project
set DB_USER=root
set DB_PASSWORD=
set DB_HOST=localhost
set DB_PORT=3308
set BACKUP_DIR=..\backups

REM XAMPP MySQL path
set MYSQL_BIN=C:\xampp\mysql\bin
set MYSQL=%MYSQL_BIN%\mysql.exe

REM Check if mysql exists
if not exist "%MYSQL%" (
    echo ERROR: mysql.exe not found at: %MYSQL%
    echo Please update MYSQL_BIN path in this script.
    pause
    exit /b 1
)

echo ========================================
echo Available Backup Files:
echo ========================================
echo.

REM List backup files with numbers
set count=0
for %%F in ("%BACKUP_DIR%\backup_*.sql") do (
    set /a count+=1
    echo !count!^) %%~nxF
    set "file!count!=%%F"
)

if %count%==0 (
    echo No backup files found in %BACKUP_DIR%
    pause
    exit /b 1
)

echo.
echo ========================================
set /p selection="Select backup number (1-%count%): "

REM Validate selection
if not defined file%selection% (
    echo Invalid selection!
    pause
    exit /b 1
)

REM Get selected file
call set BACKUP_FILE=%%file%selection%%%

echo.
echo ========================================
echo Starting Database Restore...
echo Database: %DB_NAME%
echo Backup File: %BACKUP_FILE%
echo ========================================
echo.

REM Confirm restore
set /p CONFIRM="WARNING: This will REPLACE all data in '%DB_NAME%'. Continue? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo Restore cancelled by user.
    pause
    exit /b 0
)

echo.
echo Restoring database...
echo.

REM Drop database
echo 1. Dropping existing database...
"%MYSQL%" -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -e "DROP DATABASE IF EXISTS %DB_NAME%;" 2>nul
if !ERRORLEVEL! EQU 0 (
    echo    [OK] Database dropped
) else (
    echo    [WARNING] Could not drop database
)

REM Create database
echo 2. Creating new database...
"%MYSQL%" -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if !ERRORLEVEL! EQU 0 (
    echo    [OK] Database created
) else (
    echo    [ERROR] Failed to create database
    pause
    exit /b 1
)

REM Restore data
echo 3. Restoring from backup...
"%MYSQL%" -h%DB_HOST% -P%DB_PORT% -u%DB_USER% %DB_NAME% < "%BACKUP_FILE%"
if !ERRORLEVEL! EQU 0 goto restore_success
goto restore_failure

:restore_success
echo    [OK] Data restored
echo.
echo ========================================
echo Database restored successfully!
echo ========================================
goto end

:restore_failure
echo    [ERROR] Restore failed! Error code: !ERRORLEVEL!
echo.
echo Please check:
echo   - MySQL is running
echo   - Backup file is valid SQL file
echo   - Database permissions are correct
echo.
goto end

:end
echo ========================================
pause
