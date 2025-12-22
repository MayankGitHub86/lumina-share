@echo off
echo Stopping any running Node.js processes on port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo Starting backend server...
npm run dev
