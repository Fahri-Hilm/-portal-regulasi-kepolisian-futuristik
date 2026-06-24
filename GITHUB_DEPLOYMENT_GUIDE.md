# 📤 Panduan Push ke GitHub & Deploy ke Vercel

## Prerequisite
- Sudah punya akun GitHub? https://github.com/signup
- Sudah punya akun Vercel? https://vercel.com/signup

---

## Step 1: Install Git (Jika Belum)

### Windows

**Option A: Git for Windows (Recommended)**
1. Download dari https://git-scm.com/download/win
2. Jalankan installer
3. Follow default settings (klik Next terus)
4. Buka Command Prompt baru
5. Verifikasi:
   ```bash
   git --version
   ```

**Option B: GitHub Desktop**
1. Download dari https://desktop.github.com/
2. Install dan login dengan akun GitHub
3. Skip ke Step 2

---

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `portal-regulasi-kepolisian-futuristik`
   - **Description:** Modern police regulatory portal (optional)
   - **Visibility:** Public (untuk Vercel)
3. Click "Create repository"
4. **COPY the repository URL** (https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git)

---

## Step 3: Configure Git Locally

Open Command Prompt (cmd) dan jalankan:

```bash
# Set your GitHub user information
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Verify
git config --global user.name
git config --global user.email
```

---

## Step 4: Initialize Git Repository Locally

```bash
# Navigate to project folder
cd C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik

# Initialize git
git init

# Verify
git status
```

---

## Step 5: Add All Files to Git

```bash
# Add all files
git add .

# Verify what will be committed
git status

# You should see all files listed (green = added)
```

---

## Step 6: Make First Commit

```bash
git commit -m "Initial commit: Production-ready portal with low-end device optimization"
```

---

## Step 7: Add Remote Repository

```bash
# Replace YOUR_USERNAME with actual username
git remote add origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git

# Verify
git remote -v
```

---

## Step 8: Push to GitHub

```bash
# First push (creates main branch)
git push -u origin main

# You will be asked to login:
# - Username: YOUR_GITHUB_USERNAME
# - Password: YOUR_GITHUB_TOKEN (see below)
```

### Generate GitHub Token (Recommended instead of password)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it name: `portal-regulasi-deploy`
4. Select scopes:
   - ✅ repo (full control)
   - ✅ workflow (if private)
5. Click "Generate token"
6. **COPY the token** (won't show again!)
7. Use this token as password when git asks

**Or use GitHub CLI:**
```bash
# Download: https://cli.github.com/
gh auth login
# Follow prompts
```

---

## Step 9: Verify GitHub Push

1. Go to your repository: https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik
2. Verify you see all files
3. Verify commit message showing

---

## Step 10: Deploy to Vercel

### Option A: Vercel Web UI (Easiest)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your repository URL:
   ```
   https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik
   ```
4. Click "Import"
5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL = https://ckilkxcnekayxuhxtmvj.supabase.co
     VITE_SUPABASE_ANON_KEY = [your-anon-key]
     VITE_DASHBOARD_PASSWORD = ADMIN2026
     ```
6. Click "Deploy"
7. Wait 3-5 minutes for build

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables when asked
```

---

## Step 11: Access Your Live App

After deployment completes:
- Vercel akan give you URL like: `https://portal-regulasi-xyz.vercel.app`
- Buka URL itu di browser
- App akan loading...
- Verify landing page appears instantly

---

## Troubleshooting GitHub Push

### Error: "fatal: not a git repository"
```bash
# Make sure you're in the right folder
cd C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik
git status
```

### Error: "fatal: could not read Username"
```bash
# Use GitHub token instead of password
# Get token from: https://github.com/settings/tokens
```

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
# Then re-add with correct URL
git remote add origin https://github.com/YOUR_USERNAME/...
```

### Error: "permission denied (publickey)"
```bash
# Your SSH key not configured
# Use HTTPS instead (easier):
git remote set-url origin https://github.com/YOUR_USERNAME/...
# Then try: git push -u origin main
```

---

## Troubleshooting Vercel Deployment

### Build Failed
1. Check build logs in Vercel dashboard
2. Make sure environment variables set
3. Verify `.env.example` matches what you're setting
4. Try rebuilding: Vercel Dashboard → Redeploy

### App loads but shows blank/error
1. Check browser console (F12)
2. Check Vercel logs (Deployments → Logs)
3. Check Supabase connection in env vars

### Service Worker not working
1. Check `/sw.js` loads (Network tab)
2. Clear browser cache
3. Check DevTools → Application → Service Workers

---

## Post-Deployment: Update App

Setiap kali ada perubahan:

```bash
# 1. Make changes locally
# 2. Stage changes
git add .

# 3. Commit
git commit -m "Fix: something description"

# 4. Push to GitHub
git push origin main

# 5. Vercel auto-deploys (check dashboard)
# Deployment done in 2-3 minutes
```

---

## Useful Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Undo last commit (before push)
git reset HEAD~1

# Cancel all changes (CAREFUL!)
git checkout -- .

# Remove all untracked files
git clean -fd

# Check what's different
git diff

# View remote URL
git remote -v
```

---

## Quick Reference Checklist

✅ **Before Push:**
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `git status` shows all files
- [ ] GitHub repo created

✅ **During Push:**
- [ ] `git add .` completed
- [ ] `git commit -m "..."` done
- [ ] `git push origin main` successful

✅ **After Push:**
- [ ] GitHub repo shows all files
- [ ] Vercel imported successfully
- [ ] Environment variables set
- [ ] Deployment completed
- [ ] App loads in browser

---

## Support Links

- **Git Help:** https://git-scm.com/doc
- **GitHub Help:** https://docs.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Troubleshooting:** https://github.com/contact

---

## Example Complete Flow

```bash
# 1. Install Git (first time only)
# Download from https://git-scm.com/download/win

# 2. Configure Git
git config --global user.name "Fanzy Fajuu"
git config --global user.email "email@example.com"

# 3. Go to project
cd C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik

# 4. Initialize
git init

# 5. Add files
git add .

# 6. Commit
git commit -m "Initial commit: Production-ready portal"

# 7. Add remote
git remote add origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git

# 8. Push
git push -u origin main
# Login with GitHub username + token

# 9. Open browser
# Go to: https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik
# Verify files are there

# 10. Deploy on Vercel
# Go to: https://vercel.com/new
# Import repository
# Set env vars
# Click Deploy
# Wait 3-5 minutes
# Access live URL!
```

---

## Ready to Deploy? 🚀

Follow the steps above and your app will be live on Vercel in ~5 minutes!

**Questions?** Review the troubleshooting section or check the links provided.

**Status:** Ready to push and deploy ✅
