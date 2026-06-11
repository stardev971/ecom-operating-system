"use client";

/* =========================================================================
   Ecom Operating System — Integration catalog
   -------------------------------------------------------------------------
   A categorized directory of the tools real ecommerce teams connect, plus
   per-provider authentication schemas. Drives the Integrations page and the
   Connect modal. The 12 "seeded" providers (ids matching lib/data.js
   genIntegrations) come pre-connected with live sync stats; everything else
   starts as "Not Connected" and can be connected through the Connect modal.
   ========================================================================= */

/* --------------------------- auth field schemas ------------------------- */
/* Each auth method defines the credential fields the Connect modal renders,
   a human label for the "Authentication via …" subtitle, and whether it is
   an OAuth-style redirect (single button) vs a credential form.            */
export const AUTH_METHODS = {
  oauth: {
    label: "OAuth 2.0",
    oauth: true,
    fields: [],
  },
  oauth_google: {
    label: "OAuth 2.0 (Google)",
    oauth: true,
    fields: [],
  },
  oauth_azure: {
    label: "OAuth 2.0 (Azure AD)",
    oauth: true,
    fields: [],
  },
  oauth_connected_app: {
    label: "OAuth 2.0 (Connected App)",
    oauth: true,
    fields: [],
  },
  apikey: {
    label: "API Key",
    fields: [{ key: "api_key", label: "API Key", type: "password", placeholder: "Enter API key" }],
  },
  apikey_secret: {
    label: "API Key + Secret Key",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "API Key" },
      { key: "secret_key", label: "Secret Key", type: "password", placeholder: "Enter Secret Key" },
    ],
  },
  client_secret: {
    label: "Client ID + Client Secret",
    fields: [
      { key: "client_id", label: "Client ID", type: "text", placeholder: "Client ID" },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "Client Secret" },
    ],
  },
  token: {
    label: "API Token",
    fields: [{ key: "token", label: "API Token", type: "password", placeholder: "Enter API token" }],
  },
  site_key: {
    label: "Site ID + API Key",
    fields: [
      { key: "site_id", label: "Site ID", type: "text", placeholder: "Site ID" },
      { key: "api_key", label: "API Key", type: "password", placeholder: "API Key" },
    ],
  },
  account_token: {
    label: "Account ID + API Token",
    fields: [
      { key: "account_id", label: "Account ID", type: "text", placeholder: "Account ID" },
      { key: "token", label: "API Token", type: "password", placeholder: "API Token" },
    ],
  },
  store_keys: {
    label: "Consumer Key + Secret",
    fields: [
      { key: "store_url", label: "Store URL", type: "text", placeholder: "https://yourstore.com" },
      { key: "consumer_key", label: "Consumer Key", type: "password", placeholder: "ck_..." },
      { key: "consumer_secret", label: "Consumer Secret", type: "password", placeholder: "cs_..." },
    ],
  },
};

/* ------------------------------- catalog -------------------------------- */
/* Categories ordered by relevance to a commerce operation. Each provider:
   { id, name, desc, auth, color, popular?, hint, dataCategories }          */
export const CATALOG = [
  {
    key: "ecommerce",
    name: "Ecommerce Platforms",
    blurb: "Storefronts, orders, products & inventory",
    providers: [
      { id: "shopify", name: "Shopify", desc: "Orders, products, customers & inventory sync", auth: "oauth", color: "#95bf47", popular: true, hint: "Shopify Admin → Settings → Apps → Develop apps → install the EOS app to authorize.", dataCategories: ["Orders", "Products", "Customers", "Inventory"] },
      { id: "woocommerce", name: "WooCommerce", desc: "WordPress commerce — orders & catalog", auth: "store_keys", color: "#96588a", hint: "WooCommerce → Settings → Advanced → REST API → Add key (Read/Write).", dataCategories: ["Orders", "Products"] },
      { id: "bigcommerce", name: "BigCommerce", desc: "Headless & hosted storefront data", auth: "token", color: "#121118", hint: "BigCommerce → Settings → API accounts → Create V3 API token.", dataCategories: ["Orders", "Products", "Customers"] },
      { id: "magento", name: "Adobe Commerce (Magento)", desc: "Enterprise commerce orders & catalog", auth: "token", color: "#ee672f", hint: "Magento Admin → System → Integrations → add integration & activate token.", dataCategories: ["Orders", "Products", "Inventory"] },
      { id: "amazon", name: "Amazon Seller", desc: "Marketplace orders, FBA & settlements", auth: "oauth", color: "#ff9900", popular: true, hint: "Authorize via Login with Amazon for your Seller Central account.", dataCategories: ["Orders", "FBA", "Settlements"] },
      { id: "walmart", name: "Walmart Marketplace", desc: "Walmart marketplace orders & items", auth: "client_secret", color: "#0071dc", hint: "Walmart Developer Portal → generate Client ID & Secret.", dataCategories: ["Orders", "Items"] },
      { id: "etsy", name: "Etsy", desc: "Handmade & vintage marketplace orders", auth: "oauth", color: "#f1641e", hint: "Authorize via Etsy OAuth for your shop.", dataCategories: ["Orders", "Listings"] },
      { id: "ebay", name: "eBay", desc: "eBay marketplace listings & orders", auth: "oauth", color: "#e53238", hint: "Authorize via eBay OAuth for your seller account.", dataCategories: ["Orders", "Listings"] },
    ],
  },
  {
    key: "advertising",
    name: "Advertising & Paid Media",
    blurb: "Ad spend, campaigns & conversions",
    providers: [
      { id: "meta", name: "Meta Ads", desc: "Facebook & Instagram ad performance", auth: "oauth", color: "#1877f2", popular: true, hint: "Authorize via Facebook Business login and select your ad account.", dataCategories: ["Spend", "Campaigns", "Conversions"] },
      { id: "google_ads", name: "Google Ads", desc: "Search, Shopping & PMax campaign data", auth: "oauth_google", color: "#4285f4", popular: true, hint: "Authorize via Google and pick your Ads MCC / account.", dataCategories: ["Spend", "Campaigns", "Keywords"] },
      { id: "tiktok", name: "TikTok Ads", desc: "TikTok for Business campaign performance", auth: "oauth", color: "#010101", popular: true, hint: "Authorize via TikTok for Business and select your advertiser ID.", dataCategories: ["Spend", "Campaigns"] },
      { id: "pinterest_ads", name: "Pinterest Ads", desc: "Pinterest campaign & conversion data", auth: "oauth", color: "#e60023", hint: "Authorize via Pinterest Business account.", dataCategories: ["Spend", "Campaigns"] },
      { id: "snapchat_ads", name: "Snapchat Ads", desc: "Snap Ads Manager performance", auth: "oauth", color: "#fffc00", hint: "Authorize via Snapchat Business account.", dataCategories: ["Spend", "Campaigns"] },
      { id: "microsoft_ads", name: "Microsoft Ads", desc: "Bing search advertising data", auth: "oauth", color: "#0078d4", hint: "Authorize via Microsoft Advertising account.", dataCategories: ["Spend", "Campaigns"] },
      { id: "amazon_ads", name: "Amazon Ads", desc: "Sponsored Products & Brands data", auth: "oauth", color: "#ff9900", hint: "Authorize via Amazon Advertising console.", dataCategories: ["Spend", "Campaigns"] },
    ],
  },
  {
    key: "email_sms",
    name: "Email, SMS & Automation",
    blurb: "Lifecycle messaging & marketing ops",
    providers: [
      { id: "klaviyo", name: "Klaviyo", desc: "Email & SMS flows, segments & revenue", auth: "apikey", color: "#000000", popular: true, hint: "Klaviyo → Settings → API Keys → create a Private API Key.", dataCategories: ["Flows", "Campaigns", "Revenue"] },
      { id: "mailchimp", name: "Mailchimp", desc: "Email marketing & audience automation", auth: "apikey", color: "#ffe01b", popular: true, hint: "Mailchimp → Account → Extras → API keys → Create a key.", dataCategories: ["Campaigns", "Audiences"] },
      { id: "hubspot_mkt", name: "HubSpot Marketing", desc: "Email campaigns, sequences & lead scoring", auth: "oauth", color: "#ff7a59", popular: true, hint: "Authorize via HubSpot and choose your marketing hub account.", dataCategories: ["Sequences", "Campaigns", "Contacts"] },
      { id: "attentive", name: "Attentive", desc: "SMS marketing & subscriber journeys", auth: "apikey_secret", color: "#5b34da", hint: "Attentive → Settings → API → generate key & secret.", dataCategories: ["SMS", "Journeys", "Revenue"] },
      { id: "postscript", name: "Postscript", desc: "Shopify-native SMS marketing", auth: "apikey", color: "#1a1a2e", hint: "Postscript → Settings → API → copy your secret key.", dataCategories: ["SMS", "Automations"] },
      { id: "omnisend", name: "Omnisend", desc: "Email & SMS automation for ecommerce", auth: "apikey", color: "#272561", hint: "Omnisend → Store settings → Integrations & API → API keys.", dataCategories: ["Campaigns", "Automations"] },
      { id: "customerio", name: "Customer.io", desc: "Behavioral messaging & workflows", auth: "site_key", color: "#7131ff", hint: "Customer.io → Settings → API Credentials → copy Site ID & API Key.", dataCategories: ["Workflows", "Segments"] },
    ],
  },
  {
    key: "crm",
    name: "CRM & Sales",
    blurb: "Pipeline, contacts & deal management",
    providers: [
      { id: "salesforce", name: "Salesforce", desc: "Accounts, opportunities & forecasts", auth: "oauth_connected_app", color: "#00a1e0", popular: true, hint: "Authorize via Salesforce OAuth (Connected App).", dataCategories: ["Accounts", "Opportunities", "Pipeline"] },
      { id: "hubspot_crm", name: "HubSpot CRM", desc: "Contacts, deals & sales pipeline", auth: "oauth", color: "#ff7a59", hint: "Authorize via HubSpot and select your CRM account.", dataCategories: ["Contacts", "Deals"] },
      { id: "pipedrive", name: "Pipedrive", desc: "Sales pipeline & activity tracking", auth: "token", color: "#017737", hint: "Pipedrive → Settings → Personal preferences → API → copy token.", dataCategories: ["Deals", "Activities"] },
      { id: "zoho_crm", name: "Zoho CRM", desc: "Sales automation & contact management", auth: "oauth", color: "#e42527", hint: "Authorize via Zoho OAuth.", dataCategories: ["Leads", "Contacts"] },
      { id: "klaviyo_crm", name: "Gorgias CRM", desc: "Conversational commerce & customer view", auth: "apikey", color: "#0e1e40", hint: "Gorgias → Settings → REST API → generate key.", dataCategories: ["Customers", "Conversations"] },
    ],
  },
  {
    key: "payments",
    name: "Payments & Billing",
    blurb: "Processing, payouts & reconciliation",
    providers: [
      { id: "stripe", name: "Stripe", desc: "Payments, payouts & dispute data", auth: "apikey", color: "#635bff", popular: true, hint: "Stripe Dashboard → Developers → API keys → reveal secret key.", dataCategories: ["Charges", "Payouts", "Disputes"] },
      { id: "paypal", name: "PayPal", desc: "PayPal & Braintree transactions", auth: "client_secret", color: "#003087", hint: "PayPal Developer → Apps & Credentials → Client ID & Secret.", dataCategories: ["Transactions", "Refunds"] },
      { id: "shoppay", name: "Shop Pay", desc: "Shopify accelerated checkout data", auth: "oauth", color: "#5a31f4", hint: "Authorized automatically through your Shopify connection.", dataCategories: ["Checkouts", "Conversions"] },
      { id: "affirm", name: "Affirm", desc: "Buy-now-pay-later financing data", auth: "apikey_secret", color: "#4a4af4", hint: "Affirm → Settings → API keys → public & private key.", dataCategories: ["Loans", "Conversions"] },
      { id: "adyen", name: "Adyen", desc: "Global payments & risk data", auth: "apikey", color: "#0abf53", hint: "Adyen Customer Area → Developers → API credentials.", dataCategories: ["Payments", "Risk"] },
    ],
  },
  {
    key: "shipping",
    name: "Shipping & Fulfillment",
    blurb: "Labels, tracking & 3PL operations",
    providers: [
      { id: "shipstation", name: "ShipStation", desc: "Multi-carrier shipping & tracking", auth: "apikey_secret", color: "#2c5fa8", popular: true, hint: "ShipStation → Settings → Account → API Settings → API Key & Secret.", dataCategories: ["Shipments", "Delays", "Carriers"] },
      { id: "shipbob", name: "ShipBob", desc: "3PL fulfillment & inventory locations", auth: "token", color: "#fa4616", hint: "ShipBob → Integrations → API tokens → generate token.", dataCategories: ["Fulfillment", "Inventory"] },
      { id: "shippo", name: "Shippo", desc: "Shipping rates & label generation", auth: "apikey", color: "#16a085", hint: "Shippo → Settings → API → copy live token.", dataCategories: ["Rates", "Labels"] },
      { id: "aftership", name: "AfterShip", desc: "Branded tracking & delivery updates", auth: "apikey", color: "#8e44ad", hint: "AfterShip → Settings → API keys → generate key.", dataCategories: ["Tracking", "Delivery"] },
      { id: "easypost", name: "EasyPost", desc: "Shipping API & address verification", auth: "apikey", color: "#164fff", hint: "EasyPost → Account → API Keys → production key.", dataCategories: ["Shipments", "Tracking"] },
    ],
  },
  {
    key: "support",
    name: "Customer Support & Ticketing",
    blurb: "Help desk, tickets & satisfaction",
    providers: [
      { id: "gorgias", name: "Gorgias", desc: "Ecommerce help desk & tickets", auth: "apikey", color: "#0e1e40", popular: true, hint: "Gorgias → Settings → REST API → generate username & key.", dataCategories: ["Tickets", "Satisfaction"] },
      { id: "zendesk", name: "Zendesk", desc: "Support tickets & CSAT data", auth: "oauth", color: "#03363d", popular: true, hint: "Authorize via Zendesk OAuth for your subdomain.", dataCategories: ["Tickets", "CSAT"] },
      { id: "intercom", name: "Intercom", desc: "Conversations & customer messaging", auth: "oauth", color: "#1f8ded", hint: "Authorize via Intercom OAuth.", dataCategories: ["Conversations", "Contacts"] },
      { id: "gladly", name: "Gladly", desc: "People-centered customer service", auth: "token", color: "#00a4a6", hint: "Gladly → Settings → API tokens → generate token.", dataCategories: ["Conversations", "Profiles"] },
      { id: "kustomer", name: "Kustomer", desc: "Omnichannel CRM support platform", auth: "apikey", color: "#0d1f44", hint: "Kustomer → Settings → API keys → create key.", dataCategories: ["Conversations", "Customers"] },
      { id: "reamaze", name: "Re:amaze", desc: "Helpdesk, chat & FAQ for stores", auth: "apikey", color: "#5c6ac4", hint: "Re:amaze → Settings → Public/Secret API token.", dataCategories: ["Tickets", "Chat"] },
    ],
  },
  {
    key: "reviews",
    name: "Reviews & Loyalty",
    blurb: "Social proof, ratings & retention programs",
    providers: [
      { id: "yotpo", name: "Yotpo", desc: "Reviews, ratings & loyalty programs", auth: "apikey_secret", color: "#0042e4", popular: true, hint: "Yotpo → Settings → store settings → App Key & Secret.", dataCategories: ["Reviews", "Ratings", "Loyalty"] },
      { id: "okendo", name: "Okendo", desc: "Customer reviews & UGC", auth: "apikey", color: "#5a3df5", hint: "Okendo → Settings → API → copy key.", dataCategories: ["Reviews", "UGC"] },
      { id: "stamped", name: "Stamped", desc: "Reviews, ratings & loyalty", auth: "apikey_secret", color: "#ffaa00", hint: "Stamped → Settings → API keys → public & private key.", dataCategories: ["Reviews", "Loyalty"] },
      { id: "loyaltylion", name: "LoyaltyLion", desc: "Points, rewards & referral program", auth: "token", color: "#1f2a44", hint: "LoyaltyLion → Settings → Developers → token & secret.", dataCategories: ["Points", "Rewards"] },
      { id: "smile", name: "Smile.io", desc: "Loyalty, VIP & referral rewards", auth: "apikey", color: "#ff5a5f", hint: "Smile.io → Settings → API → private key.", dataCategories: ["Points", "Referrals"] },
    ],
  },
  {
    key: "analytics",
    name: "Analytics & Attribution",
    blurb: "Traffic, funnels & marketing attribution",
    providers: [
      { id: "ga4", name: "Google Analytics 4", desc: "Sessions, funnels & attribution", auth: "oauth_google", color: "#e37400", popular: true, hint: "Authorize via Google and select your GA4 property.", dataCategories: ["Sessions", "Funnels", "Attribution"] },
      { id: "northbeam", name: "Northbeam", desc: "Multi-touch attribution & MMM", auth: "apikey_secret", color: "#111827", hint: "Northbeam → Settings → API → client id & secret.", dataCategories: ["Attribution", "ROAS"] },
      { id: "triplewhale", name: "Triple Whale", desc: "Ecommerce attribution & dashboards", auth: "apikey", color: "#0b1f3a", popular: true, hint: "Triple Whale → Settings → API keys → generate key.", dataCategories: ["Attribution", "Pixel"] },
      { id: "amplitude", name: "Amplitude", desc: "Behavioral analytics & cohorts", auth: "apikey_secret", color: "#1456ff", hint: "Amplitude → Settings → Projects → API & Secret key.", dataCategories: ["Events", "Cohorts"] },
      { id: "mixpanel", name: "Mixpanel", desc: "Product analytics & funnels", auth: "apikey_secret", color: "#7856ff", hint: "Mixpanel → Settings → Project settings → API secret.", dataCategories: ["Events", "Funnels"] },
      { id: "heap", name: "Heap", desc: "Autocapture product analytics", auth: "apikey", color: "#3742fa", hint: "Heap → Account → Manage → copy app & API key.", dataCategories: ["Events", "Journeys"] },
    ],
  },
  {
    key: "accounting",
    name: "Accounting & Finance",
    blurb: "COGS, expenses & profitability",
    providers: [
      { id: "quickbooks", name: "QuickBooks", desc: "COGS, expenses & P&L", auth: "oauth", color: "#2ca01c", popular: true, hint: "Authorize via Intuit QuickBooks Online.", dataCategories: ["COGS", "Expenses", "P&L"] },
      { id: "xero", name: "Xero", desc: "Accounting, invoices & reconciliation", auth: "oauth", color: "#13b5ea", hint: "Authorize via Xero OAuth.", dataCategories: ["Invoices", "Expenses"] },
      { id: "netsuite", name: "NetSuite", desc: "ERP financials & inventory", auth: "token", color: "#1f3864", hint: "NetSuite → Setup → Integration → token-based auth.", dataCategories: ["GL", "Inventory"] },
      { id: "avalara", name: "Avalara", desc: "Sales tax automation & compliance", auth: "account_token", color: "#ff8200", hint: "Avalara → Settings → License & API keys.", dataCategories: ["Tax", "Compliance"] },
    ],
  },
  {
    key: "subscriptions",
    name: "Subscriptions & Returns",
    blurb: "Recurring revenue & post-purchase",
    providers: [
      { id: "recharge", name: "Recharge", desc: "Subscriptions, churn & MRR", auth: "apikey", color: "#f06a6a", popular: true, hint: "Recharge → Apps → API tokens → create token.", dataCategories: ["Subscriptions", "Churn", "MRR"] },
      { id: "skio", name: "Skio", desc: "Modern subscriptions for Shopify", auth: "apikey", color: "#111827", hint: "Skio → Settings → API → copy key.", dataCategories: ["Subscriptions", "Retention"] },
      { id: "loop_returns", name: "Loop Returns", desc: "Returns, exchanges & store credit", auth: "apikey", color: "#0bbf8a", hint: "Loop → Settings → Developers → API key.", dataCategories: ["Returns", "Exchanges"] },
      { id: "narvar", name: "Narvar", desc: "Post-purchase tracking & returns", auth: "apikey_secret", color: "#00bcd4", hint: "Narvar → Settings → API credentials.", dataCategories: ["Tracking", "Returns"] },
    ],
  },
  {
    key: "communication",
    name: "Communication & Collaboration",
    blurb: "Team alerts & workflow notifications",
    providers: [
      { id: "slack", name: "Slack", desc: "Route alerts & approvals to channels", auth: "oauth", color: "#4a154b", popular: true, hint: "Authorize via Slack and pick the workspace & channel.", dataCategories: ["Alerts", "Approvals"] },
      { id: "teams", name: "Microsoft Teams", desc: "Post alerts to Teams channels", auth: "oauth_azure", color: "#5059c9", hint: "Authorize via Microsoft 365 / Azure AD.", dataCategories: ["Alerts"] },
      { id: "gmail", name: "Gmail / Google Workspace", desc: "Send reports & digests by email", auth: "oauth_google", color: "#ea4335", hint: "Authorize via Google Workspace.", dataCategories: ["Email", "Reports"] },
    ],
  },
];

/* --------------------------- derived helpers ---------------------------- */
export const ALL_PROVIDERS = CATALOG.flatMap((c) =>
  c.providers.map((p) => ({ ...p, categoryKey: c.key, categoryName: c.name }))
);

export const PROVIDER_BY_ID = Object.fromEntries(ALL_PROVIDERS.map((p) => [p.id, p]));

export const CATEGORY_TABS = [
  { key: "all", name: "All Categories" },
  ...CATALOG.map((c) => ({ key: c.key, name: c.name, count: c.providers.length })),
];

/* providers that ship pre-connected in the demo (match lib/data.js seed) */
export const DEFAULT_CONNECTED = ["shopify", "woocommerce", "meta", "google_ads", "klaviyo", "gorgias", "shipstation", "quickbooks", "ga4", "tiktok", "recharge", "yotpo"];

export const webhookFor = (id) => `https://api.eos-platform.com/webhooks/${id}/inbound`;

export function authLabel(auth) {
  return AUTH_METHODS[auth]?.label || "API Key";
}
