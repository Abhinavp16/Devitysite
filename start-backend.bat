@echo off
echo Starting DevityClub Backend Server...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Initializing database...
call npm run init-db

echo.
echo Starting backend server...
echo Backend will run on http://localhost:5000
echo.
call npm run dev