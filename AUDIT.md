# RiskVector.app — Production Readiness Audit
Date: 2026-04-10

## Executive Summary

RiskVector.app is a functional risk intelligence platform with real-time alert aggregation (GDACS, USGS, NOAA, INTERPOL, government advisories), AI-powered scenario simulation, and Stripe-integrated billing. The core product works, but lacks authentication, real user management, and several features standard in competitor platforms. It is a strong MVP but needs critical infrastructure (auth, persistence, notifications) before being production-ready for paying customers.

---

## Current State

### Pages

| Page | URL | HTTP Status | Load Time | Issues |
|------|-----|-------------|-----------|--------|
| Landing | `/` | 200 | 0.6s | Duplicate nav links on mobile; "Watch Demo" does nothing; trust logos (UN, NATO, WHO) are fake text; claims "2,400+ security teams" with no proof; footer links all `href="#"`; dual pricing sections with different currencies ($29 vs €29) |
| Dashboard | `/dashboard` | 200 | 0.5s | No auth gate; 2-column grid breaks on mobile; uses inline styles; map is basic OSM iframe; simulation duplicates `/simulate`; trend history is `Math.random()`; no loading skeleton |
| Intelligence Feed | `/news` | 200 | 0.5s | Best-designed page; live refresh every 60s; good filter/search; detail panel works; no bookmark/save/share/export |
| Simulation | `/simulate` | 200 | 0.5s | Nice 3-phase UX; output is keyword-matched templates, not real AI; no persistence of past simulations |
| Pricing | `/pricing` | 200 | 0.07s | Stripe checkout wired; Free tier always says "Current Plan"; Enterprise → mailto; price mismatch with landing ($29 vs €29) |

### APIs

| Endpoint | Method | Status | Response Time | Notes |
|----------|--------|--------|---------------|-------|
| `/api/health` | GET | 200 | 0.4s | Returns mock service status — not actually checking anything |
| `/api/alerts` | GET | 200 | 0.4s | Real data from GDACS, USGS, NOAA; returns up to 50 alerts |
| `/api/alerts/enhanced` | GET | 200 | — | Filterable by type/severity/country |
| `/api/alerts/government` | GET | 200 | — | German, US, UK travel advisories |
| `/api/alerts/news` | GET | 200 | — | NewsAPI integration; graceful fallback |
| `/api/alerts/organization` | GET | 200 | — | OCHA, WHO, Red Cross data |
| `/api/alerts/police` | GET | 200 | — | INTERPOL red notices, Europol |
| `/api/risk/[country]` | GET | 200 | **11.0s** | ⚠️ Very slow; fetches multiple external APIs; conflict zone override works; trend data is random |
| `/api/risk/[country]/emergency` | GET | 200 | 0.4s | Comprehensive emergency contacts |
| `/api/risk/[country]/historical` | GET | 200 | — | **Entirely mock data** — random generation |
| `/api/simulate` | POST | 200 | 0.4s | Keyword detection → template sections; not real AI |
| `/api/stripe/checkout` | POST | — | — | Properly configured Stripe checkout |
| `/api/stripe/portal` | POST | — | — | Customer portal (needs customerId) |
| `/api/stripe/webhook` | POST | — | — | Logs only, no DB writes |
| `/api/user/profile` | GET/POST | 200 | — | Hardcoded default user — no persistence |
| `/api/reports/generate` | POST | — | — | PDF/Excel not implemented; calls localhost:3000 |
| `/api/police/global` | GET | 200 | — | Global police data aggregator |
| `/api/police/global/[countryCode]` | GET | 200 | — | Country-specific police data |
| `/api/risk/local-police/[city]` | GET | 200 | — | German city police (RLP region) |
| `/api/admin/conflict-updates` | GET/POST/DELETE | 200 | — | Admin CRUD for conflict zone updates |
| `/api/relevant-police` | GET | 200 | — | Aggregated high-severity police reports |

---

## Competitor Analysis

| Feature | Dataminr | Everbridge | Intl SOS | WorldAware | Sitata | RiskVector |
|---------|----------|------------|----------|------------|--------|------------|
| Real-time alerts | ✅ AI | ✅ Multi-channel | ✅ Med+security | ✅ Curated | ✅ | ✅ Multi-source |
| Risk scoring | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Interactive map | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Basic iframe |
| User authentication | ✅ SSO/SAML | ✅ SSO | ✅ | ✅ | ✅ | ❌ None |
| Mobile app (native) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ Web only |
| Push notifications | ✅ | ✅ Multi-channel | ✅ | ✅ SMS/email | ✅ | ❌ None |
| Travel itinerary tracking | ✅ | ✅ | ✅ Full TMC | ✅ | ✅ | ❌ |
| Employee check-in | ✅ | ✅ Mass notify | ✅ | ✅ | ✅ | ❌ |
| API access | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Exists, no auth |
| Custom alert rules | ✅ | ✅ | ✅ | ✅ Geo-fence | ✅ | ❌ |
| PDF reports | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ Stubbed |
| Historical analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Mock data |
| Incident response workflows | ✅ | ✅ Playbooks | ✅ | ✅ | ❌ | ❌ |
| SSO/SAML | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Pricing transparency | Enterprise | Enterprise | Enterprise | Enterprise | $9-29/mo | ✅ Public |

---

## Feature Gap Analysis

### Must Have (Launch Blockers)

1. **Authentication system** — No user accounts exist. NextAuth/Auth.js with email + social login. Without this, you can't charge anyone.
2. **Database & persistence** — Everything is in-memory or localStorage. Need PostgreSQL for users, preferences, alert history, subscription state.
3. **User-specific alert preferences** — Users must select countries, set severity thresholds, choose notification channels.
4. **Push notifications** — Email + browser push at minimum. Critical for a real-time alert product.
5. **Fix `/api/risk/[country]` performance** — 11s is unacceptable. Cache external API results. Target <2s.
6. **Mobile responsiveness** — Dashboard 2-column grid has no breakpoint. Completely broken on phones.
7. **Real historical data** — Currently all `Math.random()`. Store real data over time or remove the feature.
8. **Remove fake trust signals** — "Trusted by 2,400+ teams", "UN, NATO, WHO" logos, "SOC 2 Type II", "99.99% Uptime SLA" — none are real. Legal risk.

### Should Have (Competitive Advantage)

9. **Real AI simulation** — Keyword matching + templates is not AI. Integrate an LLM for genuine scenario analysis.
10. **Interactive risk map** — Replace OSM iframe with Mapbox/Leaflet with markers, heat maps, click-to-explore.
11. **Travel itinerary management** — Users input trips → auto-monitor risks for those locations.
12. **PDF report generation** — `/api/reports/generate` is stubbed. Generate downloadable PDFs.
13. **Saved/bookmarked alerts** — Save and organize alerts for later.
14. **Alert rule builder** — Geo-fence alerts, severity thresholds, category filters, custom keywords.
15. **Stripe subscription enforcement** — Webhook handler doesn't update any DB. Track subscription server-side, gate features.
16. **Team/organization features** — Multi-user accounts, shared dashboards, admin controls.
17. **Rate limiting** — No rate limiting on any endpoint. Easy to abuse.

### Nice to Have (Future Roadmap)

18. **Native mobile apps** — iOS/Android with push, offline mode.
19. **Employee check-in system** — Mass notification + response tracking.
20. **SOS button** — Marketed on landing page but not implemented.
21. **Webhook/API for customers** — Enterprise customers receive alerts via webhook.
22. **Dark/light theme polish** — Many components don't fully support light mode.
23. **Internationalization** — Full i18n for major markets.
24. **SSO/SAML** — Enterprise B2B requirement.
25. **Incident response playbooks** — Pre-built response workflows.
26. **Real-time chat/telemedicine** — Partner with medical/security providers.

---

## UX/Design Improvements

### Navigation
- Landing page has duplicate nav links (Simulate + Intelligence appear in both nav sections on mobile). Single unified nav with hamburger menu needed.

### Mobile Responsiveness
- **Dashboard 2-column grid** — no media query, completely broken on phones.
- **Simulate page** 4-column step grid needs stacking on mobile.
- **Fix:** Add responsive breakpoints; test at 375px/768px/1024px.

### Information Hierarchy
- Dashboard crams map, scores, simulation, alerts all competing. Consider tabs or sidebar layout.

### Call-to-Action Placement
- Dashboard has no clear next action for new users. Add onboarding flow.

### Trust Signals
- **Critical:** Multiple fake trust signals (see Must Have #8). Remove or replace with real ones.
- Real trust signals that exist: live data from USGS/GDACS/INTERPOL, German police integration, government advisories from 3 countries. *Lead with these.*

### Onboarding Flow
- None exists. User sees Germany by default. Add country selection wizard on first visit.

### Empty States
- News page: adequate. Dashboard: minimal text only. Add illustrations/actionable suggestions.

### Loading States
- News: skeleton loaders ✅. Dashboard: "Loading..." text only. Simulate: spinner + context ✅.
- Add skeleton loaders to dashboard.

### Error States
- News: error banner ✅. Other pages: silent `catch { /* ignore */ }`. Add error boundaries.

---

## Technical Debt

1. **`Math.random()` for trends/history** — Misleads users. Dashboard trends, trendHistory, historical API all random.
2. **Silent error catches** — `catch { /* ignore */ }` in dashboard. Errors should surface.
3. **Inline styles in dashboard** — Raw `style={{}}` objects instead of Tailwind. Hard to maintain.
4. **GA script bug** — `gtag('config,'` missing closing quote in layout.tsx.
5. **No rate limiting** — All routes unprotected. Simulate endpoint easily abused.
6. **No CORS config** — Health check claims "cors_enabled: true" but no middleware sets CORS.
7. **Report generation calls localhost** — `/api/reports/generate` fetches `http://localhost:3000` — breaks in production.
8. **Price currency mismatch** — "$0" Free tier vs "€29" Pro. Pick one currency.
9. **localStorage subscription** — `lib/subscription.ts` uses localStorage. Trivially bypassed.
10. **No env var validation** — App starts without API keys; failures at request time.
11. **Leaflet dependency unused** — Bundle includes react-leaflet but dashboard uses OSM iframe.

---

## Recommended Implementation Order

1. **Remove fake trust signals** (1 day) — Legal/credibility risk
2. **Add authentication** — NextAuth.js + PostgreSQL (3-5 days)
3. **Add database layer** — Supabase or PlanetScale (2-3 days)
4. **Fix risk API caching** — Redis with TTL, 11s → <2s (1-2 days)
5. **Dashboard responsive redesign** (2 days)
6. **Replace random data with real data** (2 days)
7. **Notification system** — email (Resend) + browser push (3-4 days)
8. **User alert preferences** — watchlist, severity filters (2-3 days)
9. **Stripe subscription enforcement** — webhook → DB → gating (2 days)
10. **Interactive map** — Mapbox or proper Leaflet (2-3 days)
11. **Real AI simulation** — LLM integration (3-5 days)
12. **PDF report generation** (2 days)
13. **Travel itinerary feature** (3-5 days)
14. **Mobile PWA / native apps** (5-10 days)
15. **Team/enterprise features** (5-10 days)

**Total estimated effort to v1.0 launch: 6-8 weeks**

---

## What's Working Well

- **Real multi-source data aggregation** — GDACS, USGS, NOAA, INTERPOL, government advisories. Genuine and valuable.
- **Intelligence Feed** — Best page. Live refresh, filters, search, detail panel, skeleton loaders.
- **Stripe integration** — Checkout, portal, webhooks properly wired.
- **Conflict zone intelligence** — Specific advisories for 12 countries with override logic.
- **Emergency contacts database** — Comprehensive, per-country, multi-service.
- **German regional police integration** — Unique differentiator with real value.
- **Design system** — Cohesive dark theme, glass morphism, premium feel.
- **Simulation UX** — Even template-based, the 3-phase flow (input → loading → report) is well-designed.
