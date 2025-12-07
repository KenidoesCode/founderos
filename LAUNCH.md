# 🚀 FounderOS - Launch Guide

## Quick Launch (Windows)

### Option 1: Use Launch Scripts

**Terminal 1 - Backend:**
```bash
.\launch-backend.bat
```

**Terminal 2 - Frontend:**
```bash
.\launch-frontend.bat
```

### Option 2: Manual Launch

#### Step 1: Backend
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

#### Step 2: Frontend (New Terminal)
```bash
cd frontend
npm install --legacy-peer-deps
echo NEXT_PUBLIC_API_URL=http://localhost:6060 > .env.local
npm run dev
```

## Access the App

1. **Backend**: http://localhost:6060
2. **Frontend**: http://localhost:3000
3. **Health Check**: http://localhost:6060/health

## Login Credentials

- **Email**: `demo@founderos.app`
- **Password**: `demo123`

Or register a new account!

## What's Running

✅ **Backend API** - All endpoints functional
✅ **Frontend App** - Complete UI
✅ **Database** - SQLite (no Docker needed)
✅ **AI Features** - Mock mode enabled (works without OpenAI key)

## Troubleshooting

### Disk Space Issue
- Clean npm cache: `npm cache clean --force`
- Use SQLite (already configured - no Docker needed)

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/package.json` scripts

### Database Issues
- Delete `backend/prisma/dev.db` and run migrations again

## Features Ready to Test

1. **Dashboard** - Streak, priority, active startup
2. **AI Cofounder** - Ask questions, get structured responses
3. **Startup Generator** - Generate validated startup ideas
4. **Founder Genome** - Create on-chain identity
5. **Time-Warp** - See predictive execution forecasts

**Everything is ready! Just run the launch scripts! 🎉**

