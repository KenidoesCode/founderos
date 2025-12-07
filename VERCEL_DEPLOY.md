# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: founderos
# - Directory: ./
# - Override settings? No
```

### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory to `frontend`
   - Add Environment Variable:
     - `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app`)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend Deployment

The backend needs to be deployed separately to:
- **Railway** (recommended)
- **Render**
- **Fly.io**
- **Heroku**

Then update `NEXT_PUBLIC_API_URL` in Vercel to point to your backend.

## 🎯 Quick Deploy Command

```bash
cd frontend
vercel --prod
```

This will deploy to production immediately!

