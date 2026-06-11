"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

export default function KpiCard({ label, value, delta, deltaGood, icon: Icon, metric, sub, accent = "brand" }) {
  const showDelta = delta !== undefined && delta !== null;
  const positive = deltaGood !== undefined ? deltaGood : delta >= 0;
  const accents = {
    brand: "text-brand-soft bg-brand/15",
    emerald: "text-emerald bg-emerald/15",
    amber: "text-amber bg-amber/15",
    rose: "text-rose bg-rose/15",
    sky: "text-sky bg-sky/15",
    violet: "text-violet bg-violet/15",
  };
  return (
    <div className="card card-pad transition-colors hover:border-borderlight">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted">{label}</span>
          {metric && <InfoTooltip metric={metric} />}
        </div>
        {Icon && (
          <div className={`grid h-8 w-8 place-items-center rounded-lg ${accents[accent] || accents.brand}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-ink">{value}</div>
      <div className="mt-1.5 flex items-center gap-2">
        {showDelta && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-emerald" : "text-rose"}`}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-faint">{sub}</span>}
      </div>
    </div>
  );
}
