# ⚡ QUICK DEPLOY - FounderOS to Vercel

## 🎯 **3-STEP DEPLOYMENT**

### **Step 1: Prepare**
```bash
cd frontend
# Make sure you're in the frontend directory
```

### **Step 2: Deploy**
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel
```

### **Step 3: Set Environment Variable**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_URL` = `http://localhost:6060` (or your backend URL)
4. Redeploy

## 🚀 **OR USE VERCEL WEB UI**

1. **Go to:** https://vercel.com/new
2. **Connect GitHub** (or drag & drop `frontend` folder)
3. **Set Root Directory:** `frontend`
4. **Add Environment Variable:** `NEXT_PUBLIC_API_URL`
5. **Deploy!**

## ✅ **That's It!**

Your app will be live at: `https://your-project.vercel.app`

**Deploy time: ~2 minutes! 🎉**

