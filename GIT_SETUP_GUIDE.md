# 📥 Setup Git & Push ke GitHub - Step by Step

## Langkah 1: Download & Install Git

### Windows:

1. **Download Git**
   - Go to: https://git-scm.com/download/win
   - File akan auto-download (Git-2.x.x-64-bit.exe)

2. **Run Installer**
   - Double-click file yang sudah download
   - Windows Security: Click "More info" → "Run anyway"

3. **Installation Wizard**
   - Welcome: Click "Next"
   - Select Destination: Keep default, Click "Next"
   - Select Components: Keep default, Click "Next"
   - Select Start Menu: Keep default, Click "Next"
   - Choose the default editor: Select "Use Notepad++", Click "Next"
   - Configure line ending: Select "Checkout as-is, commit as-is", Click "Next"
   - Configure terminal emulator: Select "Use Windows' default console window", Click "Next"
   - Configure experimental options: Click "Next"
   - Click "Install"
   - Wait 1-2 minutes...
   - Click "Finish"

4. **Verify Installation**
   - Open Command Prompt (cmd)
   - Type: `git --version`
   - Should show: `git version 2.x.x...`
   - ✅ Git installed!

---

## Langkah 2: Configure Git

Buka Command Prompt dan jalankan:

```bash
# Set your name
git config --global user.name "Fanzy Fajuu"

# Set your email
git config --global user.email "your.email@gmail.com"

# Verify
git config --global user.name
git config --global user.email
```

**Note:** Ganti "Fanzy Fajuu" dan "your.email@gmail.com" dengan nama dan email Anda

---

## Langkah 3: Buat Repository di GitHub

1. **Login ke GitHub**
   - Go to: https://github.com/login
   - Masukkan username & password

2. **Create New Repository**
   - Click "+" di kanan atas
   - Select "New repository"
   - Fill in:
     ```
     Repository name: portal-regulasi-kepolisian-futuristik
     Description: Modern police regulatory portal (optional)
     Visibility: Public
     (Jangan check README, .gitignore, LICENSE)
     ```
   - Click "Create repository"

3. **Copy Repository URL**
   - Anda akan melihat halaman dengan tombol "HTTPS"
   - Copy URL yang terlihat:
     ```
     https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git
     ```
   - Simpan URL ini!

---

## Langkah 4: Push Project ke GitHub

### Di Command Prompt:

```bash
# 1. Navigate to project folder
cd C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik

# 2. Initialize git repository
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: Production-ready portal with low-end device optimization"

# 5. Add remote repository (GANTI URL DENGAN PUNYA ANDA!)
git remote add origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git

# 6. Push to GitHub
git push -u origin main
```

### Saat Diminta Login:

**Username:**
```
YOUR_GITHUB_USERNAME
```

**Password:**
Jangan gunakan password GitHub Anda! Gunakan **Personal Access Token**

#### Membuat GitHub Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Fill in:
   - Token name: `portal-regulasi-deploy`
   - Expiration: 90 days (atau sesuaikan)
   - Scopes: Check `repo` (full control of private repositories)
4. Click "Generate token"
5. **COPY TOKEN** (sekali copy saja, tidak akan terlihat lagi!)
6. Use this token sebagai password di command prompt

---

## Langkah 5: Verify Push Successful

1. Go to GitHub: https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik
2. Pastikan semua file sudah ada:
   - ✅ src/
   - ✅ public/
   - ✅ package.json
   - ✅ README.md
   - ✅ vercel.json
   - ✅ dll

3. Cek commit message:
   - Should show: "Initial commit: Production-ready portal..."

---

## Langkah 6: Deploy ke Vercel

Setelah push sukses:

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste URL GitHub:
   ```
   https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik
   ```
4. Click "Import"
5. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add 3 variables:
     ```
     Name: VITE_SUPABASE_URL
     Value: https://ckilkxcnekayxuhxtmvj.supabase.co
     
     Name: VITE_SUPABASE_ANON_KEY
     Value: [copy dari .env file Anda]
     
     Name: VITE_DASHBOARD_PASSWORD
     Value: ADMIN2026
     ```
6. Click "Deploy"
7. Wait 3-5 minutes...
8. ✅ App LIVE!

---

## Troubleshooting

### Error: "git is not recognized"
```
❌ Git not installed properly
✅ Solution: Restart Command Prompt setelah install Git
```

### Error: "fatal: not a git repository"
```
❌ Wrong folder
✅ Solution: Pastikan di folder: C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik
Run: git status
```

### Error: "fatal: could not read Username"
```
❌ Git credentials tidak tersimpan
✅ Solution: 
   - Use GitHub Token (bukan password)
   - Generate token: https://github.com/settings/tokens
   - Paste sebagai password
```

### Error: "Permission denied (publickey)"
```
❌ SSH key issue
✅ Solution: Gunakan HTTPS bukan SSH
git remote set-url origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git
```

### Error: "fatal: remote origin already exists"
```
❌ Remote already added
✅ Solution:
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/...
```

---

## Quick Reference

### Commands untuk Push:

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Check history
git log --oneline
```

---

## 📋 Checklist

- [ ] Git downloaded from https://git-scm.com/download/win
- [ ] Git installed (verified: `git --version`)
- [ ] Git configured (name & email)
- [ ] GitHub repository created
- [ ] Repository URL copied
- [ ] Project folder navigated to
- [ ] `git init` ran
- [ ] `git add .` ran
- [ ] `git commit -m "..."` ran
- [ ] `git remote add origin [URL]` ran
- [ ] GitHub Token generated (if needed)
- [ ] `git push -u origin main` ran successfully
- [ ] Files visible on GitHub website
- [ ] Vercel deployment started
- [ ] App live on Vercel! ✅

---

## ✅ Sudah Siap?

Setelah semua setup, jalankan di Command Prompt:

```bash
cd C:\Users\ADMINI~1\Downloads\portal-regulasi-kepolisian-futuristik
git status
```

Jika output menunjukkan "On branch main", artinya sudah siap push!

**Next:** Follow Langkah 4 di atas untuk push! 🚀
