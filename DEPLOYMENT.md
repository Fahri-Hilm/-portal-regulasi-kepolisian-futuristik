# 🚀 Deployment Guide - Portal Regulasi Kepolisian Futuristik

## Pre-Deployment Checklist

### ✅ Build & Testing
- [x] `npm run build` passes without errors
- [x] `npm run lint` passes TypeScript check
- [x] No console warnings in production build
- [x] Service Worker registers correctly
- [x] All adaptive performance tiers tested

### ✅ Environment Variables
Set these in Vercel project settings:

```env
VITE_SUPABASE_URL=https://ckilkxcnekayxuhxtmvj.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_DASHBOARD_PASSWORD=ADMIN2026  (or custom password)
```

### ✅ Vercel Configuration
- [x] `vercel.json` configured with:
  - SPA rewrites for client-side routing
  - Service Worker cache control (no-cache for sw.js)
  - Assets cache headers (1 year immutable)
  - Video/font cache headers (24h for videos, 1yr for fonts)

---

## Deployment Steps

### Option 1: Deploy via Vercel Web UI (Recommended)

1. **Connect GitHub Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select project root

2. **Configure Environment Variables**
   - Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_DASHBOARD_PASSWORD`

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)
   - Verify deployment at provided URL

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables (if not already set)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_DASHBOARD_PASSWORD
```

---

## Post-Deployment Verification

### Checklist
- [ ] App loads in < 2 seconds on 4G
- [ ] App loads in < 5 seconds on 3G
- [ ] Landing page visible immediately
- [ ] Service Worker registered (DevTools → Application → Service Workers)
- [ ] Offline mode works (disable network, page still functional)
- [ ] Dashboard password gate works
- [ ] All tabs navigation works
- [ ] Mobile responsive (test on actual device)
- [ ] Low-end device detection works (DevTools → Sensors)

### Performance Metrics

Use Lighthouse audit:
1. Open app in Chrome
2. Press F12 → Lighthouse tab
3. Run audit
4. Target: Performance > 75, Accessibility > 90

### Monitor Performance

1. **Vercel Analytics**
   - Check Vercel Dashboard → Analytics
   - Monitor Core Web Vitals
   - Track error rates

2. **Browser Console**
   - No red errors
   - Service Worker logs should show:
     ```
     [SW] Registered successfully
     [SW] Cache hit/miss logs
     ```

---

## Troubleshooting

### Issue: Service Worker not registering

**Solution:**
- Clear browser cache: DevTools → Storage → Clear site data
- Check DevTools → Application → Service Workers
- Verify `/sw.js` loads correctly (Network tab)

### Issue: Videos not loading on slow network

**Solution:**
- This is expected on 3G/slow connections
- App falls back to static background
- Videos will load when network improves

### Issue: Dashboard password not working

**Solution:**
- Verify `VITE_DASHBOARD_PASSWORD` env var is set in Vercel
- Default is `ADMIN2026`
- Redeploy after changing env var

### Issue: Supabase connection not working

**Solution:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
- Check Supabase RLS policies are correctly set
- Try offline mode (should work with localStorage)

---

## Performance Optimization Summary

### Bundle Sizes (Gzip)
- HTML: 0.86 KB
- CSS: 11.65 KB
- Main App: 81.42 KB
- Supabase: 54.63 KB
- Motion: 31.35 KB
- **Total Initial Load: ~180 KB**

### Caching Strategy (via vercel.json)
- `sw.js`: No cache (always fresh)
- `index.html`: No cache (always fresh)
- Assets (JS/CSS): 1 year immutable cache
- Videos: 24-hour cache
- Fonts: 1 year immutable cache

### Low-End Device Optimization
- ✅ Auto-detect RAM < 2GB → disable animations
- ✅ Auto-detect 3G network → lazy-load video
- ✅ Video quality tiers (LOW/MEDIUM/HIGH)
- ✅ Service Worker caching for offline support

---

## Rollback Plan

If deployment has issues:

```bash
# Revert to previous deployment
vercel rollback

# Or manually select previous deployment:
# - Go to Vercel Dashboard
# - Select deployment
# - Click "Promote to Production"
```

---

## Maintenance

### Regular Tasks

1. **Monitor Errors**
   - Check Vercel → Deployments → Errors
   - Monitor Service Worker errors

2. **Update Dependencies** (Monthly)
   ```bash
   npm outdated
   npm update
   npm run build && npm run lint
   ```

3. **Supabase Maintenance**
   - Monitor database size in Supabase dashboard
   - Check RLS policy effectiveness

### Video Management

If adding new video quality tiers:
1. Upload video files to `/public/`
2. Name convention: `Video_background_<QUALITY>.mp4`
   - `Video_background_LOW.mp4` (~100-200KB)
   - `Video_background_MEDIUM.mp4` (~1-2MB)
   - `Video_background_HIGH.mp4` (~5MB+)
3. Update `VideoBackground.tsx` if needed

---

## Support & Issues

- **Bug Reports**: Create GitHub issue with:
  - Device specs (RAM, OS, browser)
  - Network type (3G/4G/WiFi)
  - Screenshots/error messages

- **Performance Issues**: Check:
  - Browser DevTools → Performance tab
  - Lighthouse audit results
  - Service Worker cache status

---

## Environment: Vercel

- **Hosting**: Vercel Edge Network (auto-scalable)
- **Regions**: Auto-selected based on traffic
- **SSL/TLS**: Automatic (HTTPS only)
- **CDN**: Vercel's global CDN
- **Build Time**: ~2-3 minutes
- **Deployment**: Atomic (zero-downtime)

✅ **Ready to deploy!**
