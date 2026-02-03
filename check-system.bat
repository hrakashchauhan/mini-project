@echo off
echo ========================================
echo FocusAI - System Check
echo ========================================
echo.

echo [1/5] Checking if port 5000 is free...
netstat -ano | findstr :5000 > nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5000 is in use. Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /F /PID %%a > nul 2>&1
    )
    echo [OK] Port 5000 is now free
) else (
    echo [OK] Port 5000 is available
)
echo.

echo [2/5] Checking server files...
if exist "server\index.js" (
    echo [OK] server\index.js exists
) else (
    echo [ERROR] server\index.js missing!
)
if exist "server\models\Session.js" (
    echo [OK] server\models\Session.js exists
) else (
    echo [ERROR] server\models\Session.js missing!
)
if exist "server\.env" (
    echo [OK] server\.env exists
) else (
    echo [ERROR] server\.env missing!
)
echo.

echo [3/5] Checking client files...
if exist "client\src\App.jsx" (
    echo [OK] client\src\App.jsx exists
) else (
    echo [ERROR] client\src\App.jsx missing!
)
if exist "client\src\main.jsx" (
    echo [OK] client\src\main.jsx exists
) else (
    echo [ERROR] client\src\main.jsx missing!
)
if exist "client\index.html" (
    echo [OK] client\index.html exists
) else (
    echo [ERROR] client\index.html missing!
)
echo.

echo [4/5] Checking dependencies...
if exist "server\node_modules" (
    echo [OK] Server dependencies installed
) else (
    echo [WARNING] Server dependencies not installed. Run: cd server ^&^& npm install
)
if exist "client\node_modules" (
    echo [OK] Client dependencies installed
) else (
    echo [WARNING] Client dependencies not installed. Run: cd client ^&^& npm install
)
echo.

echo [5/5] System Ready!
echo ========================================
echo.
echo To start the application:
echo 1. Open a terminal and run: cd server ^&^& npm run dev
echo 2. Open another terminal and run: cd client ^&^& npm run dev
echo 3. Open browser at: http://localhost:5173
echo.
echo ========================================
pause
