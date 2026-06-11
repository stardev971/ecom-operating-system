"use client";

import InfoTooltip from "./InfoTooltip";

const ICON_ACCENTS = {
  brand: "bg-brand/15 text-brand-soft",
  emerald: "bg-emerald/15 text-emerald",
  amber: "bg-amber/15 text-amber",
  rose: "bg-rose/15 text-rose",
  sky: "bg-sky/15 text-sky",
  violet: "bg-violet/15 text-violet",
};

export function PageHeader({ title, subtitle, sources, actions, icon: Icon, iconAccent = "brand", live }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${ICON_ACCENTS[iconAccent] || ICON_ACCENTS.brand}`}>
            <Icon size={22} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink md:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          {sources && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {live && (
                <span className="chip border border-emerald/30 bg-emerald/10 text-[11px] text-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulsedot" /> Live
                </span>
              )}
              {sources.map((s) => (
                <span key={s} className="chip border border-border bg-panel text-[11px] text-muted">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, metric, action, children, className = "", pad = true }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-1.5">
            <h3 className="section-title">{title}</h3>
            {metric && <InfoTooltip metric={metric} />}
          </div>
          {action}
        </div>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </div>
  );
}

const STATUS_STYLES = {
  Connected: "bg-emerald/15 text-emerald",
  Active: "bg-emerald/15 text-emerald",
  Fulfilled: "bg-emerald/15 text-emerald",
  Scaling: "bg-sky/15 text-sky",
  Syncing: "bg-sky/15 text-sky",
  Pending: "bg-amber/15 text-amber",
  Delayed: "bg-amber/15 text-amber",
  Open: "bg-amber/15 text-amber",
  Paused: "bg-faint/20 text-muted",
  "Not Connected": "bg-faint/20 text-muted",
  Resolved: "bg-emerald/15 text-emerald",
  Closed: "bg-faint/20 text-muted",
  Underperforming: "bg-rose/15 text-rose",
  Error: "bg-rose/15 text-rose",
  Returned: "bg-rose/15 text-rose",
};

export function StatusBadge({ status }) {
  const dotPulse = status === "Syncing" ? "animate-pulsedot" : "";
  return (
    <span className={`chip ${STATUS_STYLES[status] || "bg-faint/20 text-muted"}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${dotPulse}`} />
      {status}
    </span>
  );
}

const PRIORITY_STYLES = {
  Critical: "bg-rose/15 text-rose border-rose/30",
  High: "bg-amber/15 text-amber border-amber/30",
  Medium: "bg-sky/15 text-sky border-sky/30",
  Low: "bg-faint/15 text-muted border-border",
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`chip border ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low}`}>{priority}</span>
  );
}

export function Avatar({ name, size = 34 }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const palette = ["#6366f1", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#2dd4bf"];
  let h = 0;
  for (const ch of name || "") h = (h + ch.charCodeAt(0)) % palette.length;
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
      style={{ width: size, height: size, background: palette[h] }}
    >
      {initials}
    </div>
  );
}

export function ProductMark({ name, size = 34 }) {
  const initials = (name || "?").replace(/[^a-zA-Z ]/g, "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-lg bg-panel text-[11px] font-bold text-brand-soft"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export function ProviderLogo({ name, color = "#6366f1", size = 40, rounded = "rounded-xl" }) {
  const initials = (name || "?")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`grid shrink-0 place-items-center ${rounded} text-sm font-bold text-white`}
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </div>
  );
}

export function Bar({ value, max, color = "#6366f1" }) {
  const w = Math.max(2, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-panel">
      <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon size={28} className="text-faint" />}
      <p className="text-sm font-medium text-ink">{title}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function Th({ children, right }) {
  return (
    <th className={`whitespace-nowrap px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-faint ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

export function Td({ children, right, className = "" }) {
  return <td className={`whitespace-nowrap px-4 py-3 text-sm ${right ? "text-right" : "text-left"} ${className}`}>{children}</td>;
}
