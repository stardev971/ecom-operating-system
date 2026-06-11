"use client";

import { Cpu, Activity, Sparkles, Zap, DollarSign } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, Bar } from "@/components/ui";
import { AreaTrend, Bars } from "@/components/Charts";
import { num, numCompact, usd } from "@/lib/format";

export default function AIUsage() {
  const { data, recStatus } = useApp();
  const ai = data.ai;
  const automations = Object.values(recStatus).filter((s) => s === "automated").length + 38;

  const dailyTokens = ai.dailyTokens.map((d) => ({ label: d.label, Tokens: d.tokens }));
  const dailyCost = ai.dailyTokens.map((d) => ({ label: d.label, Cost: +((d.tokens / 1_000_000) * 3.2).toFixed(2) }));
  const moduleBars = ai.moduleUsage.map((m) => ({ label: m.module.replace(" Intelligence", ""), Requests: m.requests }));
  const recByModule = ["Inventory", "Marketing", "Customer", "Operations", "Revenue"].map((m) => ({
    label: m,
    Recommendations: data.recommendations.filter((r) => r.module === m).length,
  }));
  const maxTokens = Math.max(...ai.moduleUsage.map((m) => m.tokens));

  return (
    <div>
      <PageHeader title="AI Usage" subtitle="Platform intelligence consumption across every module." icon={Cpu} iconAccent="violet" sources={["EOS AI Engine"]} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Tokens Used" value={numCompact(ai.tokensUsed)} delta={14.2} icon={Cpu} accent="brand" sub="this month" />
        <KpiCard label="AI Requests" value={num(ai.aiRequests)} delta={9.8} icon={Activity} accent="sky" />
        <KpiCard label="Recommendations" value={num(data.recommendations.length)} delta={22.0} icon={Sparkles} accent="violet" />
        <KpiCard label="Automations Triggered" value={num(automations)} delta={31.0} icon={Zap} accent="emerald" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Daily Token Usage (30d)" className="lg:col-span-2">
          <AreaTrend data={dailyTokens} series={[{ key: "Tokens", name: "Tokens", color: "#6366f1" }]} fmt={numCompact} height={260} />
        </SectionCard>
        <SectionCard title="Cost Tracking">
          <div className="mb-3 flex items-baseline gap-2">
            <DollarSign size={16} className="text-emerald" />
            <span className="text-2xl font-bold text-ink">{usd(ai.aiCost)}</span>
            <span className="text-xs text-faint">this month</span>
          </div>
          <AreaTrend data={dailyCost} series={[{ key: "Cost", name: "Daily cost", color: "#34d399" }]} fmt={(v) => `$${v}`} height={200} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard title="Module Usage">
          <Bars data={moduleBars} series={[{ key: "Requests", name: "Requests", color: "#38bdf8" }]} layout="vertical" fmt={numCompact} height={260} />
        </SectionCard>
        <SectionCard title="Recommendation Volume by Module">
          <Bars data={recByModule} series={[{ key: "Recommendations", name: "Recommendations", color: "#a78bfa" }]} height={260} />
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Usage Breakdown by Intelligence Module" pad={false}>
          <div className="divide-y divide-border/60">
            {ai.moduleUsage.map((m) => (
              <div key={m.module} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-48 text-sm font-medium text-ink">{m.module}</span>
                <div className="flex-1"><Bar value={m.tokens} max={maxTokens} color="#6366f1" /></div>
                <span className="w-24 text-right text-sm text-muted">{num(m.requests)} reqs</span>
                <span className="w-20 text-right text-sm font-semibold text-ink">{numCompact(m.tokens)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
