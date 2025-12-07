@echo off
echo Starting FounderOS Frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)
if not exist .env.local (
    echo Creating .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:6060 > .env.local
)
echo Starting frontend server...
call npm run dev

