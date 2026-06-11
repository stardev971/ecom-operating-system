# Ecom Operating System (EOS)

> "Palantir for Ecommerce Operators" — a fully interactive, executive operating interface that unifies sales, advertising, inventory, support, fulfillment, and customer intelligence into one command center.

This is a polished, realistic **demo** application. All data is simulated but internally consistent: orders roll up into customers and products, recommendations are derived from the actual generated metrics, and every cross-system KPI is interconnected.

---

## Running it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

The login page is prefilled — just click **Sign In to Dashboard** (no real auth).

```
Email:    ceo@ecomos.com
Password: password123
```

Build for production with `npm run build && npm start`.

---

## Tech stack

| Layer     | Choice                          |
|-----------|---------------------------------|
| Framework | Next.js 14 (App Router)         |
| Styling   | Tailwind CSS (custom dark theme)|
| Charts    | Recharts                        |
| Icons     | Lucide                          |
| State     | React Context + seeded mock data|

No backend. Everything runs on local state in the browser.

---

## How the data works

Instead of shipping multi-megabyte JSON files, EOS generates its dataset at runtime from a **deterministic seeded engine** (`lib/data.js`). The same seed produces the same data on every load, so server and client stay in sync and figures never drift between pages.

Generated each session (spec §20 volumes):

| Entity          | Count   |
|-----------------|---------|
| Products        | 118     |
| Customers       | 2,150   |
| Orders          | ~15,600 |
| Campaigns       | 54      |
| Support tickets | 540     |
| Reviews         | 1,080   |
| Recommendations | 112     |
| Integrations    | 12      |

Orders are distributed across 180 days with weekly seasonality and an upward trend, assigned to weighted customers and real products. Customer segments (New / Repeat / VIP / At-Risk / Churned), churn risk, LTV, product margins, inventory days-of-stock, and channel revenue are all **derived from those orders** — change the generator and every chart updates coherently.

---

## Modules

**Intelligence**
1. **Executive Overview** — CEO command center: 6 KPIs, executive insights, revenue/profit trends, channel breakdown, segmentation, top products, inventory risk, AI recommendations.
2. **Revenue & Profit Intelligence** — true profitability by product/collection/channel, loss-making products, revenue at risk, clickable product drilldowns.
3. **Marketing Intelligence** — blended ROAS/CAC/LTV, channel comparison, funnel, attribution models, AI pause/scale recommendations with live success states.
4. **Inventory Intelligence** — stockout & overstock risk, dead/fast/slow movers, with Create Purchase Order / Clearance / Adjust Spend workflow modals.
5. **Customer Intelligence** — segments, repeat-purchase trend, cohort retention heatmap, review sentiment, VIP/at-risk/high-value tables, retention campaigns.
6. **Operations Intelligence** — fulfillment time, delays, returns, support volume, warehouse performance, escalation/task workflows.
7. **AI Action Center** — the centerpiece: prioritized recommendation feed (Critical → Low) with Approve / Run Automation / View Details / Reject, filterable by priority and module.

**Platform**
8. **Integrations** — connected & available sources with status (Connected / Syncing / Error), detail modals (last sync, records, health, data categories).
9. **AI Usage** — tokens, requests, cost tracking, per-module breakdowns.
10. **Reports** — six prebuilt reports with Generate PDF / Export CSV / Schedule workflows.
11. **Settings** — Organization, Users, Notifications, AI Preferences, Integrations, Theme, Audit Logs.

**Global** — top-bar search (products, customers, campaigns, recommendations) with a results page, a notification center with unread states, and an **info (i) tooltip framework** on cross-system metrics showing source systems, calculation logic, and business meaning (spec §17).

---

## Project structure

```
app/
  layout.js              Root layout (fonts, globals)
  page.js                Login / marketing page
  (dashboard)/
    layout.js            Sidebar + topbar shell + AppProvider
    overview/            Executive Overview
    revenue/  marketing/  inventory/
    customers/  operations/  ai-center/
    integrations/  ai-usage/  reports/  settings/
    search/              Global search results
components/
  Providers.js           Data + recommendation/notification state + toasts
  Sidebar.js  Topbar.js
  KpiCard.js  Modal.js  InfoTooltip.js  RecommendationCard.js
  Charts.js              Recharts wrappers (area, line, bars, donut)
  ui.js                  Shared primitives (badges, tables, avatars…)
lib/
  data.js                Seeded mock-data engine + aggregates
  metrics.js             Info-tooltip metric dictionary
  search.js  format.js
```

All data is mock data — the demo is designed to feel production-ready while remaining fully self-contained.
