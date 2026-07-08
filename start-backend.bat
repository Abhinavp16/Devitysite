@echo off
echo Starting DevityClub Backend Server...
echo.

cd backend

echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
echo Backend will run on http://localhost:5001 unless PORT is overridden
echo.
call npm run dev
