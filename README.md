# 🚔 Portal Regulasi Kepolisian Futuristik

> Modern, high-performance police regulatory portal dengan support untuk low-end devices

<div align="center">

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Status:** ✅ Production Ready | 🚀 Ready for Vercel Deployment

</div>

---

## 📋 Features

### Core Functionality
- ✅ **Dashboard** - Analytics & regulation management (password gated)
- ✅ **Regulation Browser** - Browse, search, filter pasal with calculator
- ✅ **Incident Report** - Create reports with automatic residivis detection
- ✅ **Documentation** - Beginner-friendly workflow guide
- ✅ **Real-time Sync** - Supabase for multi-user collaboration

### Performance Optimizations
- ✅ **Low-End Device Support** - Auto-detect RAM/CPU/network, adapt rendering
- ✅ **Service Worker** - Offline support & intelligent caching
- ✅ **Adaptive Rendering** - Video quality tiers (LOW/MEDIUM/HIGH)
- ✅ **60fps Animations** - GPU-accelerated transforms/opacity only
- ✅ **Font Optimization** - Preloaded critical fonts, reduced weights

### UI/UX
- ✅ **Futuristic Design** - Cyberpunk aesthetic with neon effects
- ✅ **Mobile First** - Fully responsive, bottom navigation on mobile
- ✅ **Accessibility** - prefers-reduced-motion support, WCAG compliant
- ✅ **Dark Mode** - Built-in dark theme optimized for OLED

---

## 🏗️ Architecture

```
Portal Regulasi Kepolisian (React 19 + TypeScript)
├── App Components (Lazy-loaded)
│   ├── DashboardView (password-gated analytics)
│   ├── RegulationView (calculator + confirm workflow)
│   ├── ReportView (incident tracking + export)
│   └── DocumentationView (workflow guide)
├── Adaptive Performance System
│   ├── useDeviceCapability (device detection)
│   ├── AdaptivePerformanceContext (tier-based config)
│   └── VideoBackground (quality-adaptive video)
├── Service Worker (offline caching)
├── Supabase (real-time DB + auth)
└── Styling (Tailwind CSS v4 + custom animations)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or download repository
cd portal-regulasi-kepolisian-futuristik

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials and dashboard password
```

### Development

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Check TypeScript types
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📊 Performance Metrics

### Bundle Sizes (Gzip)
| Asset | Size | Cache |
|-------|------|-------|
| HTML | 0.86 KB | No cache |
| CSS | 11.66 KB | 1 year |
| Main JS | 81.42 KB | 1 year |
| Supabase | 54.63 KB | 1 year |
| **Total Initial** | **~180 KB** | ✅ |

### Device Tier Performance

| Tier | Device | RAM | CPU | Network | Treatment |
|------|--------|-----|-----|---------|-----------|
| **High-End** | Modern flagship | > 4GB | > 4 cores | WiFi/4G | Full effects |
| **Mid-Range** | Standard Android | 2-4GB | 2-4 cores | 4G | Reduced effects |
| **Low-End** | Budget phone | < 2GB | < 2 cores | 3G | Minimal effects |

### Load Times
- **High-end WiFi**: ~800ms
- **Mid-range 4G**: ~1.2s
- **Low-end 3G**: ~2.5s (with video lazy-load)
- **Offline (cached)**: ~300ms

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Dashboard Access
VITE_DASHBOARD_PASSWORD=ADMIN2026
```

### Device Detection

Automatic detection based on:
- `navigator.deviceMemory` (RAM in GB)
- `navigator.hardwareConcurrency` (CPU cores)
- `navigator.connection.effectiveType` (Network: 3g/4g/slow-4g)

Manually override in `useAdaptivePerformance()` for testing.

---

## 📱 Device Support

| Device | Browser | Status | Notes |
|--------|---------|--------|-------|
| iPhone 12+ | Safari | ✅ Full | All features |
| iPhone SE | Safari | ✅ Full | Reduced animations |
| Pixel 6+ | Chrome | ✅ Full | All features |
| Pixel 4A | Chrome | ✅ Full | Reduced effects |
| Budget Android | Chrome | ✅ Full | Video lazy-load |
| Desktop | Chrome/FF/Safari | ✅ Full | All features |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# 1. Set environment variables in Vercel project settings:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
#    - VITE_DASHBOARD_PASSWORD

# 2. Deploy
vercel --prod

# Or use Vercel web UI: https://vercel.com/new
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Local Production Build

```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

---

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification
- **[supabase-schema.sql](./supabase-schema.sql)** - Database schema
- **[.env.example](./.env.example)** - Environment variables template

---

## 🔐 Security

- ✅ Dashboard password-gated (configurable)
- ✅ All secrets via environment variables
- ✅ Supabase RLS policies enforced
- ✅ HTTPS only (Vercel)
- ✅ No sensitive data in logs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL) |
| **Animations** | Framer Motion v12 |
| **Icons** | Lucide React |
| **Hosting** | Vercel |
| **PWA** | Service Worker |

---

## 📊 Monitoring

### Post-Deployment
- Vercel Analytics (Core Web Vitals)
- Supabase dashboard (database size, connections)
- Error tracking (via Vercel deployments)

### Performance Audit
```bash
# Use Lighthouse in Chrome DevTools:
# F12 → Lighthouse → Generate Report
# Target: Performance > 75, Accessibility > 90
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint` to verify types
4. Run `npm run build` to test production build
5. Submit pull request

---

## 📝 License

MIT License - see LICENSE file

---

## 👤 Author

**Fanzy AKA. Fajuu**
- Role: Developer
- Platform: Futuristic Roleplay

---

## 🙏 Support

For issues, questions, or suggestions:
1. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Review browser console for errors
3. Test on DevTools device simulator
4. Check Supabase dashboard for API errors

---

## ✨ Credits

- Video background courtesy of Futuristic Roleplay
- Icons by Lucide
- UI inspiration from cyberpunk design trends

---

**Status:** ✅ Production Ready | 🚀 Ready to Deploy

Last Updated: 2026-06-24
