"use client";

/* =========================================================================
   Ecom Operating System — Seeded mock-data engine
   -------------------------------------------------------------------------
   Deterministic generator (mulberry32) so server and client produce the
   exact same dataset (no hydration mismatch). Generated once, cached at
   module scope, and consumed everywhere through the DataContext.

   Volumes (spec §20):
     Products 100+ · Customers 2,000+ · Orders 15,000+ · Campaigns 50+
     Support tickets 500+ · Reviews 1,000+ · Recommendations 100+
   ========================================================================= */

const SEED = 20260611;
const DAYS = 180; // history window
const NOW = new Date("2026-06-11T12:00:00Z").getTime();
const DAY = 86400000;

/* ----------------------------- PRNG + helpers --------------------------- */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32(SEED);
const reseed = (s) => (rnd = mulberry32(s));
const rand = () => rnd();
const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const rf = (min, max) => rand() * (max - min) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickW = (arr, weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    if ((r -= weights[i]) <= 0) return arr[i];
  }
  return arr[arr.length - 1];
};
const round2 = (n) => Math.round(n * 100) / 100;
const round0 = (n) => Math.round(n);
const gauss = (mean, sd) => {
  const u = 1 - rand();
  const v = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const dayStart = (ts) => {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
};
const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const monthKey = (ts) => {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};
const monthLabel = (ts) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", year: "2-digit" });

/* ------------------------------ reference data -------------------------- */
export const CHANNELS = [
  { id: "meta", name: "Meta Ads", color: "#6366f1" },
  { id: "google", name: "Google Ads", color: "#38bdf8" },
  { id: "tiktok", name: "TikTok Ads", color: "#fb7185" },
  { id: "email", name: "Email (Klaviyo)", color: "#34d399" },
  { id: "organic", name: "Organic", color: "#fbbf24" },
  { id: "direct", name: "Direct", color: "#a78bfa" },
];

const CATEGORIES = [
  { name: "Audio", collection: "Sound Lab", words: ["Wireless Earbuds", "Studio Headphones", "Portable Speaker", "Soundbar", "Noise-Cancel Buds", "Desk Mic"] },
  { name: "Wearables", collection: "Active Tech", words: ["Smart Watch", "Fitness Band", "Sleep Ring", "GPS Tracker", "Heart Monitor"] },
  { name: "Home", collection: "Living Co.", words: ["Aroma Diffuser", "Smart Lamp", "Ceramic Mug Set", "Linen Throw", "Wall Clock", "Storage Basket"] },
  { name: "Beauty", collection: "Glow Ritual", words: ["Vitamin C Serum", "Jade Roller", "Hydrating Mask", "Lip Oil", "Cleansing Balm", "Night Cream"] },
  { name: "Apparel", collection: "Everyday Wear", words: ["Merino Tee", "Relaxed Hoodie", "Tech Joggers", "Linen Shirt", "Puffer Vest", "Knit Beanie"] },
  { name: "Fitness", collection: "Move Series", words: ["Resistance Set", "Yoga Mat Pro", "Kettlebell 12kg", "Foam Roller", "Jump Rope", "Grip Trainer"] },
  { name: "Accessories", collection: "Carry Line", words: ["Crossbody Bag", "Leather Wallet", "Travel Pouch", "Cable Organizer", "Sunglasses", "Phone Case"] },
  { name: "Outdoor", collection: "Trailhead", words: ["Insulated Bottle", "Camp Lantern", "Day Pack", "Trail Towel", "Pocket Knife", "Rain Shell"] },
];
const PRODUCT_SUFFIX = ["Pro", "Max", "Lite", "X", "2.0", "Plus", "Mini", "Air", "Elite", "Core", ""];
const SUPPLIERS = ["Shenzhen Apex", "Lin Manufacturing", "NorthBay Goods", "Atlas Supply Co.", "Meridian Works", "Pacific Source", "Verde Labs", "Crafted&Co"];

const FIRST = ["Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "Lucas", "Mia", "Aiden", "Amelia", "Caleb", "Harper", "Ryan", "Evelyn", "Nathan", "Abigail", "Owen", "Grace", "Leo", "Chloe", "Dylan", "Zoe", "Adrian", "Layla", "Jonah", "Nora", "Eli", "Hazel", "Miles", "Aria", "Theo", "Ruby", "Felix", "Iris", "Marcus", "Elena", "Priya", "Diego", "Yuki", "Omar", "Lena", "Kai", "Maya", "Sofia", "Andre", "Tara", "Victor"];
const LAST = ["Carter", "Bennett", "Reyes", "Nguyen", "Patel", "Brooks", "Foster", "Hughes", "Morgan", "Russell", "Coleman", "Simmons", "Powell", "Long", "Flores", "Barnes", "Fisher", "Hayes", "Gibson", "Mills", "Ford", "Wagner", "Olsen", "Marsh", "Vance", "Kerr", "Doyle", "Frost", "Lam", "Sato", "Khan", "Rossi", "Mendez", "Park", "Cohen", "Walsh", "Bauer", "Novak", "Ali", "Costa"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Austin", "Seattle", "Denver", "Miami", "Boston", "Portland", "Atlanta", "Nashville", "San Diego", "Toronto", "London", "Sydney", "Berlin", "Dublin", "Vancouver"];

const CAMPAIGN_THEME = ["Spring Collection", "Summer Launch", "Best Sellers", "Retargeting", "New Arrivals", "Flash Sale", "VIP Early Access", "Abandoned Cart", "Lookalike 1%", "Prospecting Broad", "Brand Search", "Competitor Conquest", "Holiday Gift Guide", "Bundle & Save", "Back in Stock", "UGC Creators", "Loyalty Reactivation", "Bundle Promo", "Welcome Flow", "Win-back 90d"];

/* ------------------------------- products ------------------------------ */
function genProducts(n) {
  const out = [];
  const used = new Set();
  let i = 0;
  while (out.length < n) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const base = pick(cat.words);
    const suffix = pick(PRODUCT_SUFFIX);
    const name = `${base}${suffix ? " " + suffix : ""}`;
    const key = name + cat.name;
    if (used.has(key)) {
      i++;
      continue;
    }
    used.add(key);
    const id = out.length + 1;
    const price = round2(rf(14, 320) * (cat.name === "Audio" || cat.name === "Wearables" ? 1.4 : 1));
    const marginPct = rf(0.28, 0.68);
    const cost = round2(price * (1 - marginPct));
    const velocity = round2(Math.max(0.1, gauss(7, 6))); // units/day
    const stock = ri(0, 1400);
    const adSpend = round2(Math.max(0, gauss(velocity * 9, velocity * 6)));
    out.push({
      id,
      sku: `${cat.name.slice(0, 3).toUpperCase()}-${String(1000 + id)}`,
      name,
      category: cat.name,
      collection: cat.collection,
      supplier: pick(SUPPLIERS),
      price,
      cost,
      marginPct: round2(marginPct),
      stock,
      velocity,
      leadTimeDays: ri(7, 45),
      adSpend30d: adSpend,
      // running tallies filled during order generation:
      unitsSold: 0,
      revenue: 0,
      cogs: 0,
      orders: 0,
    });
    i++;
  }
  return out;
}

/* ------------------------------ customers ------------------------------ */
function genCustomers(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const fn = pick(FIRST);
    const ln = pick(LAST);
    const propensity = rf(0.2, 1); // weighting for order assignment
    out.push({
      id: i + 1,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${ri(1, 99)}@example.com`,
      city: pick(CITIES),
      propensity,
      acceptsEmail: rand() > 0.18,
      // filled from orders:
      orders: 0,
      spent: 0,
      firstOrder: null,
      lastOrder: null,
      segment: "New",
      churnRisk: 0,
      ltv: 0,
      aov: 0,
    });
  }
  return out;
}

/* -------------------------------- orders ------------------------------- */
function genOrders(products, customers, targetCount) {
  const orders = [];
  const orderChannels = ["meta", "google", "tiktok", "email", "organic", "direct"];
  const channelW = [22, 18, 10, 16, 20, 14];

  // customer weighting (cumulative) for weighted pick
  const custWeights = customers.map((c) => c.propensity);
  const custTotal = custWeights.reduce((a, b) => a + b, 0);

  const perDay = targetCount / DAYS;
  let id = 1000;
  for (let d = DAYS - 1; d >= 0; d--) {
    const ts = dayStart(NOW - d * DAY);
    const date = new Date(ts);
    const dow = date.getUTCDay();
    // weekly seasonality + slight upward trend toward present
    const weekend = dow === 0 || dow === 6 ? 0.82 : 1.05;
    const trend = 0.78 + ((DAYS - d) / DAYS) * 0.5; // grows ~ +50% across window
    const noise = rf(0.8, 1.2);
    const count = Math.max(1, Math.round(perDay * weekend * trend * noise));
    for (let k = 0; k < count; k++) {
      // weighted customer
      let r = rand() * custTotal;
      let ci = 0;
      for (; ci < customers.length; ci++) {
        if ((r -= custWeights[ci]) <= 0) break;
      }
      const cust = customers[Math.min(ci, customers.length - 1)];
      const channel = pickW(orderChannels, channelW);
      const lines = ri(1, 3);
      let revenue = 0;
      let cogs = 0;
      const items = [];
      for (let li = 0; li < lines; li++) {
        const p = products[ri(0, products.length - 1)];
        const qty = pickW([1, 2, 3, 4], [70, 20, 7, 3]);
        const lineRev = round2(p.price * qty);
        const lineCogs = round2(p.cost * qty);
        revenue += lineRev;
        cogs += lineCogs;
        p.unitsSold += qty;
        p.revenue = round2(p.revenue + lineRev);
        p.cogs = round2(p.cogs + lineCogs);
        p.orders += 1;
        items.push({ productId: p.id, qty, price: p.price });
      }
      const discount = rand() < 0.22 ? round2(revenue * rf(0.05, 0.2)) : 0;
      revenue = round2(revenue - discount);
      const shipDelayed = rand() < 0.09;
      const returned = rand() < 0.06;
      const order = {
        id: `#${id++}`,
        customerId: cust.id,
        ts,
        date: fmtDate(ts),
        channel,
        items,
        units: items.reduce((a, b) => a + b.qty, 0),
        revenue,
        cogs,
        discount,
        grossProfit: round2(revenue - cogs),
        status: returned ? "Returned" : shipDelayed ? "Delayed" : "Fulfilled",
        shipDelayed,
        returned,
      };
      orders.push(order);
      // roll up to customer
      cust.orders += 1;
      cust.spent = round2(cust.spent + revenue);
      if (!cust.firstOrder || ts < cust.firstOrder) cust.firstOrder = ts;
      if (!cust.lastOrder || ts > cust.lastOrder) cust.lastOrder = ts;
    }
  }

  // finalize customer derived fields + segment
  for (const c of customers) {
    c.ltv = c.spent;
    c.aov = c.orders ? round2(c.spent / c.orders) : 0;
    const daysSince = c.lastOrder ? Math.floor((NOW - c.lastOrder) / DAY) : 999;
    c.daysSinceOrder = daysSince;
    if (c.orders === 0) {
      c.segment = "New";
      c.churnRisk = 0;
    } else if (c.spent > 900 && c.orders >= 4) {
      c.segment = "VIP";
    } else if (daysSince > 95 && c.orders >= 1) {
      c.segment = "Churned";
    } else if (daysSince > 55) {
      c.segment = "At-Risk";
    } else if (c.orders >= 2) {
      c.segment = "Repeat";
    } else {
      c.segment = "New";
    }
    // churn risk score 0-100
    c.churnRisk = Math.max(
      0,
      Math.min(100, Math.round(daysSince * 0.7 + (c.orders <= 1 ? 25 : 0) - (c.segment === "VIP" ? 15 : 0) + gauss(0, 6)))
    );
  }
  return orders;
}

/* ------------------------------ campaigns ------------------------------ */
function genCampaigns(n) {
  const out = [];
  const adChannels = ["meta", "google", "tiktok", "email"];
  for (let i = 0; i < n; i++) {
    const channel = adChannels[i % adChannels.length];
    const theme = CAMPAIGN_THEME[i % CAMPAIGN_THEME.length];
    const spend = round2(rf(800, 26000));
    const roas = round2(Math.max(0.4, gauss(channel === "email" ? 6.2 : 3.1, 1.8)));
    const revenue = round2(spend * roas);
    const orders = Math.max(1, Math.round(revenue / rf(48, 130)));
    const clicks = Math.round(spend / rf(0.5, 2.4));
    const impressions = Math.round(clicks / rf(0.008, 0.03));
    const cac = round2(spend / orders);
    let status = "Active";
    if (roas < 1.4) status = "Underperforming";
    else if (roas > 5) status = "Scaling";
    else if (rand() < 0.12) status = "Paused";
    out.push({
      id: `cmp_${1000 + i}`,
      name: `${theme} — ${CHANNELS.find((c) => c.id === channel).name.split(" ")[0]}`,
      channel,
      status,
      spend,
      revenue,
      roas,
      orders,
      clicks,
      impressions,
      ctr: round2((clicks / impressions) * 100),
      cac,
      cvr: round2((orders / clicks) * 100),
    });
  }
  return out;
}

/* ------------------------------- tickets ------------------------------- */
function genTickets(n, customers) {
  const out = [];
  const topics = ["Where is my order?", "Return request", "Damaged item", "Wrong item received", "Refund status", "Exchange size", "Cancel order", "Product question", "Discount code issue", "Subscription change"];
  const channelsT = ["Email", "Chat", "Instagram", "Phone"];
  const prio = ["Low", "Medium", "High", "Urgent"];
  for (let i = 0; i < n; i++) {
    const ts = dayStart(NOW - ri(0, 45) * DAY);
    const status = pickW(["Open", "Pending", "Resolved", "Closed"], [22, 18, 35, 25]);
    out.push({
      id: `T-${5000 + i}`,
      customerId: customers[ri(0, customers.length - 1)].id,
      subject: pick(topics),
      channel: pick(channelsT),
      priority: pickW(prio, [40, 35, 18, 7]),
      status,
      ts,
      date: fmtDate(ts),
      firstResponseMins: ri(4, 600),
      satisfaction: status === "Resolved" || status === "Closed" ? ri(3, 5) : null,
    });
  }
  return out;
}

/* ------------------------------- reviews ------------------------------- */
function genReviews(n, products, customers) {
  const out = [];
  const pos = ["Absolutely love it", "Exceeded expectations", "Great quality", "Will buy again", "Fast shipping, perfect", "My new favorite"];
  const neu = ["It's fine", "Does the job", "Okay for the price", "Average experience"];
  const neg = ["Arrived damaged", "Not as described", "Disappointed", "Stopped working", "Too small"];
  for (let i = 0; i < n; i++) {
    const stars = pickW([5, 4, 3, 2, 1], [52, 24, 10, 7, 7]);
    const body = stars >= 4 ? pick(pos) : stars === 3 ? pick(neu) : pick(neg);
    const ts = dayStart(NOW - ri(0, DAYS) * DAY);
    out.push({
      id: `R-${i + 1}`,
      productId: products[ri(0, products.length - 1)].id,
      customerId: customers[ri(0, customers.length - 1)].id,
      stars,
      body,
      sentiment: stars >= 4 ? "Positive" : stars === 3 ? "Neutral" : "Negative",
      ts,
      date: fmtDate(ts),
    });
  }
  return out;
}

/* ----------------------------- integrations ---------------------------- */
function genIntegrations() {
  const defs = [
    ["shopify", "Shopify", "Ecommerce platform", "Connected", ["Orders", "Products", "Customers", "Inventory"]],
    ["woocommerce", "WooCommerce", "Ecommerce platform", "Connected", ["Orders", "Products"]],
    ["meta", "Meta Ads", "Advertising", "Connected", ["Spend", "Campaigns", "Conversions"]],
    ["google_ads", "Google Ads", "Advertising", "Connected", ["Spend", "Campaigns", "Keywords"]],
    ["klaviyo", "Klaviyo", "Email & SMS", "Connected", ["Flows", "Campaigns", "Revenue"]],
    ["gorgias", "Gorgias", "Customer support", "Syncing", ["Tickets", "Satisfaction"]],
    ["shipstation", "ShipStation", "Fulfillment", "Connected", ["Shipments", "Delays", "Carriers"]],
    ["quickbooks", "QuickBooks", "Accounting", "Connected", ["COGS", "Expenses", "P&L"]],
    ["ga4", "Google Analytics 4", "Analytics", "Connected", ["Sessions", "Funnels", "Attribution"]],
    ["tiktok", "TikTok Ads", "Advertising", "Error", ["Spend", "Campaigns"]],
    ["recharge", "Recharge", "Subscriptions", "Connected", ["Subscriptions", "Churn", "MRR"]],
    ["yotpo", "Yotpo", "Reviews & loyalty", "Connected", ["Reviews", "Ratings", "Loyalty"]],
  ];
  return defs.map(([id, name, category, status, cats], i) => ({
    id,
    name,
    category,
    status,
    dataCategories: cats,
    lastSync:
      status === "Error"
        ? "Failed 3h ago"
        : status === "Syncing"
        ? "Syncing now…"
        : `${ri(2, 58)} min ago`,
    recordsSynced: ri(4200, 480000),
    health: status === "Connected" ? ri(96, 100) : status === "Syncing" ? ri(80, 95) : ri(20, 45),
  }));
}

/* ------------------------- recommendations (AI) ------------------------ */
function genRecommendations(products, campaigns, customers, n) {
  const out = [];
  const atRisk = [...products].sort((a, b) => a.stock / a.velocity - b.stock / b.velocity);
  const overstock = [...products].sort((a, b) => b.stock / (b.velocity || 1) - a.stock / (a.velocity || 1));
  const bestCampaigns = [...campaigns].sort((a, b) => b.roas - a.roas);
  const worstCampaigns = [...campaigns].sort((a, b) => a.roas - b.roas);

  const push = (o) => out.push({ id: `rec_${out.length + 1}`, status: "pending", ts: dayStart(NOW - ri(0, 6) * DAY), ...o });

  // Inventory critical
  atRisk.slice(0, 14).forEach((p) => {
    const days = Math.max(1, Math.round(p.stock / Math.max(0.5, p.velocity)));
    push({
      module: "Inventory",
      type: "Inventory Risk",
      priority: days < 7 ? "Critical" : days < 14 ? "High" : "Medium",
      title: `${p.name} will stock out in ${days} days`,
      detail: `At current velocity (${p.velocity}/day) inventory of ${p.stock} units depletes in ${days} days. Lead time is ${p.leadTimeDays} days.`,
      action: "Create Purchase Order",
      impact: `${round0(p.velocity * 14)} units of demand at risk`,
      ref: { productId: p.id },
    });
  });
  // Marketing scale / pause
  bestCampaigns.slice(0, 8).forEach((c) => {
    push({
      module: "Marketing",
      type: "Scale Campaign",
      priority: c.roas > 5 ? "High" : "Medium",
      title: `${c.name} generates ${c.roas}x ROAS`,
      detail: `Spending $${c.spend.toLocaleString()} returned $${c.revenue.toLocaleString()}. Headroom to scale budget +30%.`,
      action: "Scale Campaign",
      impact: `+$${round0(c.revenue * 0.3).toLocaleString()} projected revenue`,
      ref: { campaignId: c.id },
    });
  });
  worstCampaigns.slice(0, 8).forEach((c) => {
    push({
      module: "Marketing",
      type: "Pause Campaign",
      priority: c.roas < 1 ? "Critical" : "High",
      title: `${c.name} underperforming at ${c.roas}x ROAS`,
      detail: `Spending $${c.spend.toLocaleString()} returned only $${c.revenue.toLocaleString()}. Below 1.4x break-even target.`,
      action: "Pause Campaign",
      impact: `Save $${round0(c.spend * 0.6).toLocaleString()}/mo in wasted spend`,
      ref: { campaignId: c.id },
    });
  });
  // Overstock / clearance
  overstock.slice(0, 8).forEach((p) => {
    const dos = Math.round(p.stock / Math.max(0.5, p.velocity));
    push({
      module: "Inventory",
      type: "Overstock Risk",
      priority: dos > 200 ? "High" : "Medium",
      title: `${p.name} has ${dos} days of inventory`,
      detail: `${p.stock} units in stock vs ${p.velocity}/day velocity. Capital tied up: $${round0(p.stock * p.cost).toLocaleString()}.`,
      action: "Run Clearance Campaign",
      impact: `Free up $${round0(p.stock * p.cost * 0.6).toLocaleString()} working capital`,
      ref: { productId: p.id },
    });
  });
  // Customer churn
  const churnCount = customers.filter((c) => c.churnRisk > 70).length;
  push({
    module: "Customer",
    type: "Churn Risk",
    priority: "High",
    title: `${churnCount.toLocaleString()} customers show churn risk`,
    detail: `Customers with no purchase in 55+ days and declining engagement. Win-back flow recommended.`,
    action: "Trigger Win-back Campaign",
    impact: `$${round0(churnCount * 42).toLocaleString()} retained LTV potential`,
    ref: {},
  });
  // Operations
  push({
    module: "Operations",
    type: "Returns Spike",
    priority: "Medium",
    title: `Returns increased 24% on ${pick(products).name}`,
    detail: `Return rate trending above category benchmark. Investigate sizing / quality.`,
    action: "Investigate SKU",
    impact: "Protect margin on top SKU",
    ref: {},
  });

  // pad to n with rotated variants
  let pi = 0;
  while (out.length < n) {
    const p = products[pi % products.length];
    push({
      module: "Revenue",
      type: "Margin Alert",
      priority: pickW(["Medium", "Low"], [40, 60]),
      title: `Review pricing on ${p.name}`,
      detail: `Gross margin ${Math.round(p.marginPct * 100)}% with $${p.adSpend30d.toLocaleString()} ad spend in last 30 days.`,
      action: "View Details",
      impact: "Margin optimization opportunity",
      ref: { productId: p.id },
    });
    pi++;
  }
  return out.sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return order[a.priority] - order[b.priority];
  });
}

/* ------------------------------ aggregates ----------------------------- */
function buildAggregates({ products, customers, orders, campaigns, tickets, reviews }) {
  const last30 = NOW - 30 * DAY;
  const prev30 = NOW - 60 * DAY;

  // daily + monthly revenue, channel split
  const daily = {};
  const monthly = {};
  const channelRev = {};
  CHANNELS.forEach((c) => (channelRev[c.id] = 0));
  let rev30 = 0,
    revPrev30 = 0,
    gp30 = 0,
    orders30 = 0,
    cogs30 = 0,
    returns30 = 0,
    delayed30 = 0,
    units30 = 0,
    discount30 = 0;
  const buyers30 = new Set();
  const returningBuyers30 = new Set();

  for (const o of orders) {
    const dk = o.ts;
    if (!daily[dk]) daily[dk] = { ts: dk, revenue: 0, profit: 0, orders: 0, spend: 0 };
    daily[dk].revenue = round2(daily[dk].revenue + o.revenue);
    daily[dk].profit = round2(daily[dk].profit + o.grossProfit);
    daily[dk].orders += 1;
    const mk = monthKey(o.ts);
    if (!monthly[mk]) monthly[mk] = { key: mk, ts: o.ts, label: monthLabel(o.ts), revenue: 0, profit: 0, orders: 0 };
    monthly[mk].revenue = round2(monthly[mk].revenue + o.revenue);
    monthly[mk].profit = round2(monthly[mk].profit + o.grossProfit);
    monthly[mk].orders += 1;

    if (o.ts >= last30) {
      rev30 += o.revenue;
      gp30 += o.grossProfit;
      cogs30 += o.cogs;
      orders30 += 1;
      units30 += o.units;
      discount30 += o.discount;
      channelRev[o.channel] = round2((channelRev[o.channel] || 0) + o.revenue);
      if (o.returned) returns30 += 1;
      if (o.shipDelayed) delayed30 += 1;
      const cust = customers[o.customerId - 1];
      if (cust) {
        if (buyers30.has(cust.id)) returningBuyers30.add(cust.id);
        buyers30.add(cust.id);
        if (cust.orders >= 2) returningBuyers30.add(cust.id);
      }
    } else if (o.ts >= prev30) {
      revPrev30 += o.revenue;
    }
  }

  // marketing spend (30d) from campaigns scaled to a monthly figure
  const marketingSpend = round2(campaigns.reduce((a, c) => a + c.spend, 0) / 6); // window spread
  const adSpend30 = round2(products.reduce((a, p) => a + p.adSpend30d, 0));
  const totalMarketing = round2(Math.max(marketingSpend, adSpend30));
  const netProfit30 = round2(gp30 - totalMarketing);

  const dailyArr = Object.values(daily).sort((a, b) => a.ts - b.ts);
  // attach a rough daily marketing spend line
  dailyArr.forEach((d) => (d.spend = round2((totalMarketing / 30) * rf(0.8, 1.2))));
  const monthlyArr = Object.values(monthly).sort((a, b) => a.ts - b.ts);

  const revChange = revPrev30 ? round2(((rev30 - revPrev30) / revPrev30) * 100) : 0;

  // products derived
  products.forEach((p) => {
    p.grossProfit = round2(p.revenue - p.cogs);
    p.realMargin = p.revenue ? round2((p.grossProfit / p.revenue) * 100) : 0;
    p.netAfterAds = round2(p.grossProfit - p.adSpend30d);
    p.daysOfStock = Math.round(p.stock / Math.max(0.4, p.velocity));
    p.inventoryValue = round2(p.stock * p.cost);
  });

  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 12);
  const lossMakers = [...products].filter((p) => p.netAfterAds < 0).sort((a, b) => a.netAfterAds - b.netAfterAds).slice(0, 10);
  const stockoutRisk = [...products].filter((p) => p.daysOfStock <= 21).sort((a, b) => a.daysOfStock - b.daysOfStock);
  const deadInventory = [...products].filter((p) => p.daysOfStock > 180).sort((a, b) => b.inventoryValue - a.inventoryValue);
  const fastMovers = [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10);
  const slowMovers = [...products].sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 10);

  // profit by collection / channel
  const byCollection = {};
  products.forEach((p) => {
    if (!byCollection[p.collection]) byCollection[p.collection] = { name: p.collection, revenue: 0, profit: 0, adSpend: 0 };
    byCollection[p.collection].revenue = round2(byCollection[p.collection].revenue + p.revenue);
    byCollection[p.collection].profit = round2(byCollection[p.collection].profit + p.grossProfit);
    byCollection[p.collection].adSpend = round2(byCollection[p.collection].adSpend + p.adSpend30d);
  });
  const profitByCollection = Object.values(byCollection).sort((a, b) => b.profit - a.profit);

  const profitByChannel = CHANNELS.map((c) => {
    const r = channelRev[c.id] || 0;
    return { id: c.id, name: c.name, color: c.color, revenue: r, profit: round2(r * rf(0.34, 0.52)) };
  }).sort((a, b) => b.revenue - a.revenue);

  // customer segmentation
  const segments = {};
  ["New", "Repeat", "VIP", "At-Risk", "Churned"].forEach((s) => (segments[s] = { name: s, count: 0, value: 0 }));
  customers.forEach((c) => {
    segments[c.segment].count += 1;
    segments[c.segment].value = round2(segments[c.segment].value + c.spent);
  });
  const segmentArr = Object.values(segments);

  const vipCustomers = [...customers].filter((c) => c.segment === "VIP").sort((a, b) => b.spent - a.spent).slice(0, 12);
  const atRiskCustomers = [...customers].filter((c) => c.churnRisk > 60 && c.orders > 0).sort((a, b) => b.spent - a.spent).slice(0, 12);
  const highValue = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 12);

  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.orders >= 2).length;
  const repeatRate = round2((repeatCustomers / totalCustomers) * 100);
  const avgLtv = round2(customers.reduce((a, c) => a + c.spent, 0) / totalCustomers);
  const churnRiskCount = customers.filter((c) => c.churnRisk > 70).length;

  // repeat purchase trend (monthly repeat share)
  const repeatTrend = monthlyArr.map((m) => ({ label: m.label, rate: round2(rf(28, 46)) }));

  // cohort (retention by month-since-first, simulated decay)
  const cohortMonths = monthlyArr.slice(-6).map((m) => m.label);
  const cohort = cohortMonths.map((label, i) => {
    const row = { cohort: label, size: ri(180, 420) };
    for (let m = 0; m <= 5; m++) {
      if (m + i > 5) {
        row[`m${m}`] = null;
      } else {
        row[`m${m}`] = m === 0 ? 100 : Math.max(8, round0(100 * Math.pow(0.62, m) * rf(0.9, 1.1)));
      }
    }
    return row;
  });

  // marketing aggregates
  const totalSpend = round2(campaigns.reduce((a, c) => a + c.spend, 0));
  const totalCampRev = round2(campaigns.reduce((a, c) => a + c.revenue, 0));
  const blendedRoas = round2(totalCampRev / totalSpend);
  const totalCampOrders = campaigns.reduce((a, c) => a + c.orders, 0);
  const blendedCac = round2(totalSpend / totalCampOrders);
  const convRate = round2(rf(2.1, 3.6));

  const channelCompare = CHANNELS.filter((c) => ["meta", "google", "tiktok", "email"].includes(c.id)).map((c) => {
    const cc = campaigns.filter((x) => x.channel === c.id);
    const spend = round2(cc.reduce((a, x) => a + x.spend, 0));
    const revenue = round2(cc.reduce((a, x) => a + x.revenue, 0));
    return { id: c.id, name: c.name, color: c.color, spend, revenue, roas: spend ? round2(revenue / spend) : 0, orders: cc.reduce((a, x) => a + x.orders, 0) };
  });

  const funnel = [
    { stage: "Sessions", value: ri(520000, 600000) },
    { stage: "Product Views", value: 0 },
    { stage: "Add to Cart", value: 0 },
    { stage: "Checkout", value: 0 },
    { stage: "Purchase", value: orders30 },
  ];
  funnel[1].value = round0(funnel[0].value * rf(0.42, 0.5));
  funnel[2].value = round0(funnel[1].value * rf(0.22, 0.3));
  funnel[3].value = round0(funnel[2].value * rf(0.45, 0.55));
  funnel[4].value = round0(funnel[3].value * rf(0.5, 0.62));

  const attribution = [
    { model: "Last Click", meta: 38, google: 30, tiktok: 12, email: 20 },
    { model: "First Click", meta: 44, google: 22, tiktok: 20, email: 14 },
    { model: "Linear", meta: 35, google: 28, tiktok: 17, email: 20 },
    { model: "Data-Driven", meta: 40, google: 27, tiktok: 15, email: 18 },
  ];

  // operations aggregates
  const returnRate = round2((returns30 / Math.max(1, orders30)) * 100);
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "Pending").length;
  const avgFulfillment = round2(rf(1.3, 2.4));
  const shippingDelays = delayed30;

  const supportVolume = lastNDays(14).map((ts) => ({
    label: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tickets: tickets.filter((t) => t.ts === ts).length || ri(18, 46),
  }));
  const returnTrend = monthlyArr.map((m) => ({ label: m.label, rate: round2(rf(3.5, 8.5)) }));
  const fulfillmentPerf = lastNDays(14).map((ts) => ({
    label: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hours: round2(rf(28, 52)),
  }));
  const warehouses = [
    { name: "Reno, NV", orders: ri(3200, 5200), onTime: round2(rf(93, 99)), avgHours: round2(rf(20, 36)) },
    { name: "Columbus, OH", orders: ri(2800, 4800), onTime: round2(rf(90, 98)), avgHours: round2(rf(24, 40)) },
    { name: "Dallas, TX", orders: ri(2400, 4200), onTime: round2(rf(88, 97)), avgHours: round2(rf(26, 44)) },
    { name: "Newark, NJ", orders: ri(2000, 3800), onTime: round2(rf(85, 96)), avgHours: round2(rf(30, 50)) },
  ];

  // reviews
  const avgRating = round2(reviews.reduce((a, r) => a + r.stars, 0) / reviews.length);
  const sentiment = { Positive: 0, Neutral: 0, Negative: 0 };
  reviews.forEach((r) => (sentiment[r.sentiment] += 1));

  // AI usage
  const aiModules = ["Revenue Intelligence", "Marketing Intelligence", "Inventory Intelligence", "Customer Intelligence", "Operations Intelligence"];
  const moduleUsage = aiModules.map((m) => ({ module: m, requests: ri(1800, 9000), tokens: ri(900000, 4200000) }));
  const tokensUsed = moduleUsage.reduce((a, m) => a + m.tokens, 0);
  const aiRequests = moduleUsage.reduce((a, m) => a + m.requests, 0);
  const dailyTokens = lastNDays(30).map((ts) => ({
    label: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tokens: round0(rf(120000, 380000)),
  }));
  const aiCost = round2((tokensUsed / 1000000) * 3.2);

  return {
    kpis: {
      revenue30: round2(rev30),
      revChange,
      grossProfit30: round2(gp30),
      grossMargin: round2((gp30 / Math.max(1, rev30)) * 100),
      marketingSpend: totalMarketing,
      netProfit30,
      netMargin: round2((netProfit30 / Math.max(1, rev30)) * 100),
      orders30,
      aov30: round2(rev30 / Math.max(1, orders30)),
      cogs30: round2(cogs30),
      units30,
      discount30: round2(discount30),
      returningPct: round2((returningBuyers30.size / Math.max(1, buyers30.size)) * 100),
      roas: blendedRoas,
      cac: blendedCac,
      ltv: avgLtv,
      convRate,
      repeatRate,
      churnRiskCount,
      returnRate,
      openTickets,
      avgFulfillment,
      shippingDelays,
      inventoryValue: round2(products.reduce((a, p) => a + p.inventoryValue, 0)),
      avgRating,
    },
    dailyArr,
    monthlyArr,
    channelRev,
    topProducts,
    lossMakers,
    stockoutRisk,
    deadInventory,
    fastMovers,
    slowMovers,
    profitByCollection,
    profitByChannel,
    segmentArr,
    vipCustomers,
    atRiskCustomers,
    highValue,
    repeatTrend,
    cohort,
    marketing: { totalSpend, totalCampRev, blendedRoas, blendedCac, convRate, channelCompare, funnel, attribution },
    operations: { returnRate, openTickets, avgFulfillment, shippingDelays, supportVolume, returnTrend, fulfillmentPerf, warehouses },
    reviews: { avgRating, sentiment },
    ai: { tokensUsed, aiRequests, moduleUsage, dailyTokens, aiCost },
  };
}

function lastNDays(n) {
  const out = [];
  for (let d = n - 1; d >= 0; d--) out.push(dayStart(NOW - d * DAY));
  return out;
}

/* ------------------------------ assemble ------------------------------- */
let _cache = null;
export function getDataset() {
  if (_cache) return _cache;
  reseed(SEED);
  const integrations = genIntegrations();
  const products = genProducts(118);
  const customers = genCustomers(2150);
  const orders = genOrders(products, customers, 15600);
  const campaigns = genCampaigns(54);
  const tickets = genTickets(540, customers);
  const reviews = genReviews(1080, products, customers);
  const recommendations = genRecommendations(products, campaigns, customers, 112);
  const agg = buildAggregates({ products, customers, orders, campaigns, tickets, reviews });

  _cache = {
    meta: {
      generatedAt: NOW,
      counts: {
        products: products.length,
        customers: customers.length,
        orders: orders.length,
        campaigns: campaigns.length,
        tickets: tickets.length,
        reviews: reviews.length,
        recommendations: recommendations.length,
      },
    },
    integrations,
    products,
    customers,
    orders,
    campaigns,
    tickets,
    reviews,
    recommendations,
    ...agg,
  };
  return _cache;
}

export const helpers = { fmtDate, monthLabel };

/* ------------------------- date-range windowing ------------------------ *
   Lets the dashboard recompute window-dependent metrics for the date range
   chosen in the top bar (7 / 30 / 90 days / year-to-date). Recomputed from
   the raw orders so the numbers genuinely respond to the selection. Pure
   (no randomness) so server and client agree — no hydration mismatch.     */
export const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];
const _yearStart = Date.UTC(new Date(NOW).getUTCFullYear(), 0, 1);
export const RANGE_DAYS = {
  "Last 7 days": 7,
  "Last 30 days": 30,
  "Last 90 days": 90,
  "This year": Math.min(DAYS, Math.max(1, Math.floor((NOW - _yearStart) / DAY) + 1)),
};
export const RANGE_LABEL = {
  "Last 7 days": "7d",
  "Last 30 days": "30d",
  "Last 90 days": "90d",
  "This year": "YTD",
};

let _winCache = {};
export function computeWindow(days) {
  if (_winCache[days]) return _winCache[days];
  const ds = getDataset();
  const since = NOW - days * DAY;
  const prevSince = NOW - 2 * days * DAY;

  let revenue = 0, grossProfit = 0, cogs = 0, orders = 0, units = 0, discount = 0, returns = 0, delayed = 0, prevRevenue = 0;
  const channelRev = {};
  CHANNELS.forEach((c) => (channelRev[c.id] = 0));
  const buyers = new Set();
  const returning = new Set();
  const dailyMap = {};

  for (const o of ds.orders) {
    if (o.ts >= since) {
      revenue += o.revenue;
      grossProfit += o.grossProfit;
      cogs += o.cogs;
      orders += 1;
      units += o.units;
      discount += o.discount;
      channelRev[o.channel] = round2((channelRev[o.channel] || 0) + o.revenue);
      if (o.returned) returns += 1;
      if (o.shipDelayed) delayed += 1;
      const c = ds.customers[o.customerId - 1];
      if (c) {
        if (buyers.has(c.id)) returning.add(c.id);
        buyers.add(c.id);
        if (c.orders >= 2) returning.add(c.id);
      }
      if (!dailyMap[o.ts]) dailyMap[o.ts] = { ts: o.ts, revenue: 0, profit: 0, orders: 0, spend: 0 };
      dailyMap[o.ts].revenue = round2(dailyMap[o.ts].revenue + o.revenue);
      dailyMap[o.ts].profit = round2(dailyMap[o.ts].profit + o.grossProfit);
      dailyMap[o.ts].orders += 1;
    } else if (o.ts >= prevSince) {
      prevRevenue += o.revenue;
    }
  }

  const marketingSpend = round2(ds.kpis.marketingSpend * (days / 30));
  const netProfit = round2(grossProfit - marketingSpend);
  const dailyArr = Object.values(dailyMap).sort((a, b) => a.ts - b.ts);
  const dailySpend = round2(marketingSpend / Math.max(1, days));
  dailyArr.forEach((d) => (d.spend = dailySpend));
  const revChange = prevRevenue ? round2(((revenue - prevRevenue) / prevRevenue) * 100) : 0;

  const res = {
    days,
    kpis: {
      ...ds.kpis,
      revenue30: round2(revenue),
      revChange,
      grossProfit30: round2(grossProfit),
      grossMargin: round2((grossProfit / Math.max(1, revenue)) * 100),
      marketingSpend,
      netProfit30: netProfit,
      netMargin: round2((netProfit / Math.max(1, revenue)) * 100),
      orders30: orders,
      aov30: round2(revenue / Math.max(1, orders)),
      cogs30: round2(cogs),
      units30: units,
      discount30: round2(discount),
      returningPct: round2((returning.size / Math.max(1, buyers.size)) * 100),
      returnRate: round2((returns / Math.max(1, orders)) * 100),
      shippingDelays: delayed,
    },
    channelRev,
    dailyArr,
    marketingSpend,
  };
  _winCache[days] = res;
  return res;
}
