@echo off
REM ========================================
REM Sync Database: Localhost -> Remote Server
REM ========================================

REM กำหนดค่า LOCAL (Localhost)
set LOCAL_DB=eduweb_project
set LOCAL_USER=root
set LOCAL_PASSWORD=
set LOCAL_HOST=localhost
set LOCAL_PORT=3308

REM กำหนดค่า REMOTE (Server VM)
set REMOTE_DB=eduweb_project
set REMOTE_USER=root
set REMOTE_PASSWORD=your_remote_password
set REMOTE_HOST=192.168.1.24
set REMOTE_PORT=3306

REM ชื่อไฟล์ temp
set TEMP_FILE=temp_sync_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set TEMP_FILE=%TEMP_FILE: =0%

echo ========================================
echo Database Sync: Local to Remote Server
echo ========================================
echo.
echo Source (Local):
echo   - Host: %LOCAL_HOST%:%LOCAL_PORT%
echo   - Database: %LOCAL_DB%
echo.
echo Target (Remote):
echo   - Host: %REMOTE_HOST%:%REMOTE_PORT%
echo   - Database: %REMOTE_DB%
echo.
echo ========================================
echo.

set /p CONFIRM="⚠️  This will REPLACE remote data with local data. Continue? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo ❌ Sync cancelled by user.
    pause
    exit /b 0
)

echo.
echo 📦 Step 1/3: Backing up local database...
mysqldump -h%LOCAL_HOST% -P%LOCAL_PORT% -u%LOCAL_USER% %LOCAL_DB% > %TEMP_FILE% 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Local backup failed!
    del %TEMP_FILE% 2>nul
    pause
    exit /b 1
)
echo ✅ Local backup completed: %TEMP_FILE%

echo.
echo 📤 Step 2/3: Uploading to remote server...
REM Option 1: ถ้ามี SSH access
REM scp %TEMP_FILE% user@%REMOTE_HOST%:/tmp/%TEMP_FILE%

REM Option 2: ใช้ network share (ถ้าเป็น Windows network)
REM copy %TEMP_FILE% \\%REMOTE_HOST%\share\%TEMP_FILE%

REM Option 3: Manual upload (แสดงคำแนะนำ)
echo.
echo Please upload the file manually:
echo   Source: %cd%\%TEMP_FILE%
echo   Target: Remote server at %REMOTE_HOST%
echo.
pause

echo.
echo 🔄 Step 3/3: Restoring on remote server...
echo.
echo Run this command on the REMOTE SERVER:
echo.
echo mysql -h%REMOTE_HOST% -P%REMOTE_PORT% -u%REMOTE_USER% -p %REMOTE_DB% ^< %TEMP_FILE%
echo.
echo Or use this script on remote server:
echo   cd /path/to/backend/scripts
echo   ./restore-database.sh
echo.

echo ========================================
echo.
set /p CLEANUP="Delete temporary file %TEMP_FILE%? (y/n): "
if /i "%CLEANUP%"=="y" (
    del %TEMP_FILE%
    echo ✅ Temporary file deleted.
)

echo.
echo ========================================
pause
