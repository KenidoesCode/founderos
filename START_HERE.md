# 🚀 START HERE - FounderOS Launch

## ⚡ **FASTEST WAY TO LAUNCH**

### **Method 1: Double-Click Launch (Easiest)**

1. **Open TWO PowerShell/Command Prompt windows**

2. **Window 1 - Backend:**
   ```powershell
   cd C:\Projects\FounderOS
   .\launch-backend.bat
   ```

3. **Window 2 - Frontend:**
   ```powershell
   cd C:\Projects\FounderOS
   .\launch-frontend.bat
   ```

### **Method 2: Manual Commands**

**Terminal 1:**
```bash
cd C:\Projects\FounderOS\backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

**Terminal 2:**
```bash
cd C:\Projects\FounderOS\frontend
npm install --legacy-peer-deps
echo NEXT_PUBLIC_API_URL=http://localhost:6060 > .env.local
npm run dev
```

## 🌐 **Access the App**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:6060
- **Health Check**: http://localhost:6060/health

## 🔑 **Login**

- **Email**: `demo@founderos.app`
- **Password**: `demo123`

## ✅ **What's Working**

- ✅ Full-stack application
- ✅ AI Cofounder with RAG
- ✅ Startup Generator
- ✅ Founder Genome
- ✅ Time-Warp predictions
- ✅ Dashboard
- ✅ Authentication

## 🎯 **Test Features**

1. Login → Dashboard
2. Click "Ask Cofounder" → Chat with AI
3. Click "Generate Startup" → Create ideas
4. Click "Genome" → Create identity
5. Click "Time Warp" → See predictions

**Everything is ready! Launch it now! 🚀**

