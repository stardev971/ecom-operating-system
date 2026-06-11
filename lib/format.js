export const usd = (n, opts = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts.cents ? 2 : 0,
    minimumFractionDigits: opts.cents ? 2 : 0,
  }).format(n || 0);

export const usdCompact = (n) => {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v)}`;
};

export const num = (n) => new Intl.NumberFormat("en-US").format(Math.round(n || 0));

export const numCompact = (n) => {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return `${Math.round(v)}`;
};

export const pct = (n, digits = 1) => `${(n || 0).toFixed(digits)}%`;

export const signedPct = (n, digits = 1) => `${n >= 0 ? "+" : ""}${(n || 0).toFixed(digits)}%`;
