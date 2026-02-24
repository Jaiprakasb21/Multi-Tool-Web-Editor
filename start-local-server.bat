@echo off
echo ========================================
echo Starting Local Server for Testing
echo ========================================
echo.
echo Choose your option:
echo 1. Python Server (Port 8000)
echo 2. Node.js Server (Port 3000)
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto python
if "%choice%"=="2" goto nodejs
if "%choice%"=="3" goto end

:python
echo.
echo Starting Python server on http://localhost:8000
echo.
echo Open your browser and go to:
echo   - IRCTC: http://localhost:8000/irctc/
echo   - Tools: http://localhost:8000/tools/
echo   - Test Page: http://localhost:8000/test-local.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
goto end

:nodejs
echo.
echo Starting Node.js server on http://localhost:3000
echo.
echo Open your browser and go to:
echo   - IRCTC: http://localhost:3000/irctc/
echo   - Tools: http://localhost:3000/tools/
echo   - Test Page: http://localhost:3000/test-local.html
echo.
echo Press Ctrl+C to stop the server
echo.
npx serve -p 3000
goto end

:end
pause
