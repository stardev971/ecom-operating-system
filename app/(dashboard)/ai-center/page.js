"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, Flame, Circle, CheckCircle2, Zap } from "lucide-react";
import { useApp } from "@/components/Providers";
import { PageHeader, SectionCard } from "@/components/ui";
import RecommendationCard from "@/components/RecommendationCard";

const PRIORITIES = ["All", "Critical", "High", "Medium", "Low"];
const MODULES = ["All", "Inventory", "Marketing", "Customer", "Operations", "Revenue"];

export default function AICenter() {
  const { data, recStatus } = useApp();
  const [prio, setPrio] = useState("All");
  const [mod, setMod] = useState("All");
  const [showActioned, setShowActioned] = useState(false);

  const recs = data.recommendations.filter((r) => {
    const status = recStatus[r.id] || "pending";
    if (!showActioned && status !== "pending") return false;
    if (prio !== "All" && r.priority !== prio) return false;
    if (mod !== "All" && r.module !== mod) return false;
    return true;
  });

  const counts = {
    Critical: data.recommendations.filter((r) => r.priority === "Critical").length,
    High: data.recommendations.filter((r) => r.priority === "High").length,
    Medium: data.recommendations.filter((r) => r.priority === "Medium").length,
    Low: data.recommendations.filter((r) => r.priority === "Low").length,
  };
  const actioned = data.recommendations.filter((r) => (recStatus[r.id] || "pending") !== "pending").length;
  const pending = data.recommendations.length - actioned;

  return (
    <div>
      <PageHeader
        title="AI Action Center"
        subtitle="Every insight, converted into an executable action. Approve, automate, or dismiss."
        icon={Sparkles}
        iconAccent="brand"
        actions={
          <span className="chip border border-brand/30 bg-brand/10 text-brand-soft">
            <Sparkles size={13} /> {data.recommendations.length} active recommendations
          </span>
        }
      />

      {/* summary tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile icon={AlertTriangle} tint="text-rose" label="Critical" value={counts.Critical} sub="need attention now" />
        <Tile icon={Flame} tint="text-amber" label="High Priority" value={counts.High} sub="this week" />
        <Tile icon={Zap} tint="text-violet" label="Actioned" value={actioned} sub="approved or automated" />
        <Tile icon={Circle} tint="text-sky" label="Pending" value={pending} sub="awaiting review" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {/* filters */}
        <div className="lg:col-span-1">
          <SectionCard title="Filters">
            <div className="space-y-5">
              <FilterGroup label="Priority" options={PRIORITIES} value={prio} onChange={setPrio} />
              <FilterGroup label="Module" options={MODULES} value={mod} onChange={setMod} />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={showActioned} onChange={(e) => setShowActioned(e.target.checked)} className="accent-brand" />
                Show actioned items
              </label>
            </div>
          </SectionCard>
        </div>

        {/* feed */}
        <div className="space-y-3 lg:col-span-3">
          {recs.length === 0 ? (
            <div className="card flex flex-col items-center gap-2 py-16 text-center">
              <CheckCircle2 size={32} className="text-emerald" />
              <p className="text-sm font-medium text-ink">Nothing in this view</p>
              <p className="text-xs text-muted">Adjust filters or toggle actioned items to see more.</p>
            </div>
          ) : (
            recs.map((r) => <RecommendationCard key={r.id} rec={r} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, tint, label, value, sub }) {
  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Icon size={16} className={tint} />
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-faint">{sub}</p>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="label mb-2 text-faint">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${value === o ? "bg-brand/20 text-brand-soft" : "border border-border text-muted hover:text-ink"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
