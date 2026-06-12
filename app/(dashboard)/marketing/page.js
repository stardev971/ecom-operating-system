"use client";

import { useState } from "react";
import { Target, Users, Repeat, MousePointerClick, Megaphone } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, StatusBadge, Th, Td, Bar } from "@/components/ui";
import { Bars } from "@/components/Charts";
import RecommendationCard from "@/components/RecommendationCard";
import { usd, usdCompact, num, pct } from "@/lib/format";

const CH_COLOR = { meta: "#6366f1", google: "#38bdf8", tiktok: "#fb7185", email: "#34d399" };

export default function Marketing() {
  const { data, recStatus, metrics, rangeDays, rangeLabel, range } = useApp();
  const k = metrics;
  const m = data.marketing;
  const scale = (rangeDays || 30) / 30;
  const [tab, setTab] = useState("all");

  const campaigns = [...data.campaigns]
    .filter((c) => (tab === "all" ? true : c.channel === tab))
    .sort((a, b) => b.revenue - a.revenue);

  const channelBars = m.channelCompare.map((c) => ({ label: c.name.split(" ")[0], Revenue: c.revenue * scale, Spend: c.spend * scale }));
  const attrBars = m.attribution.map((a) => ({ label: a.model, Meta: a.meta, Google: a.google, TikTok: a.tiktok, Email: a.email }));
  const maxFunnel = m.funnel[0].value;

  const marketingRecs = data.recommendations
    .filter((r) => r.module === "Marketing" && (recStatus[r.id] || "pending") === "pending")
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Marketing Intelligence"
        subtitle={`Centralized acquisition performance across every paid and owned channel. ${range}.`}
        icon={Megaphone}
        iconAccent="violet"
        live
        sources={["Meta", "Google", "TikTok", "Klaviyo"]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Blended ROAS" value={`${k.roas}x`} delta={7.5} icon={Target} metric="roas" accent="brand" />
        <KpiCard label="CAC" value={usd(k.cac)} delta={12.0} deltaGood={false} icon={Users} metric="cac" accent="rose" />
        <KpiCard label="LTV" value={usd(k.ltv)} delta={4.4} icon={Repeat} metric="ltv" accent="emerald" />
        <KpiCard label="Conversion Rate" value={pct(k.convRate)} delta={0.4} icon={MousePointerClick} metric="convRate" accent="sky" />
        <KpiCard label="Campaign Revenue" value={usdCompact(m.totalCampRev * scale)} delta={9.1} icon={Megaphone} metric="revenue" accent="violet" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard title="Channel Comparison" metric="roas">
          <Bars
            data={channelBars}
            series={[
              { key: "Revenue", name: "Revenue", color: "#6366f1" },
              { key: "Spend", name: "Spend", color: "#fb7185" },
            ]}
            fmt={usdCompact}
            height={260}
          />
        </SectionCard>
        <SectionCard title="Attribution Overview" metric="roas">
          <Bars
            data={attrBars}
            stacked
            series={[
              { key: "Meta", name: "Meta", color: "#6366f1" },
              { key: "Google", name: "Google", color: "#38bdf8" },
              { key: "TikTok", name: "TikTok", color: "#fb7185" },
              { key: "Email", name: "Email", color: "#34d399" },
            ]}
            fmt={(v) => `${v}%`}
            height={260}
          />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Funnel */}
        <SectionCard title="Funnel Analysis" metric="convRate">
          <div className="space-y-3 py-1">
            {m.funnel.map((f, i) => {
              const prev = i === 0 ? f.value : m.funnel[i - 1].value;
              const conv = i === 0 ? 100 : (f.value / prev) * 100;
              return (
                <div key={f.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted">{f.stage}</span>
                    <span className="font-medium text-ink">{num(f.value)}</span>
                  </div>
                  <Bar value={f.value} max={maxFunnel} color={["#6366f1", "#5b6ef1", "#38bdf8", "#34d399", "#fbbf24"][i]} />
                  {i > 0 && <p className="mt-0.5 text-[11px] text-faint">{pct(conv)} step conversion</p>}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Campaign performance table */}
        <SectionCard title="Campaign Performance" metric="roas" className="lg:col-span-2" pad={false}
          action={
            <div className="flex gap-1">
              {["all", "meta", "google", "tiktok", "email"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize ${tab === t ? "bg-brand/20 text-brand-soft" : "text-faint hover:text-muted"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          }>
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-border bg-card">
                <tr>
                  <Th>Campaign</Th>
                  <Th right>Spend</Th>
                  <Th right>Revenue</Th>
                  <Th right>ROAS</Th>
                  <Th right>Status</Th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-cardhover">
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: CH_COLOR[c.channel] }} />
                        <span className="font-medium text-ink">{c.name}</span>
                      </div>
                    </Td>
                    <Td right className="text-muted">{usdCompact(c.spend * scale)}</Td>
                    <Td right className="text-muted">{usdCompact(c.revenue * scale)}</Td>
                    <Td right className={`font-semibold ${c.roas >= 3 ? "text-emerald" : c.roas < 1.4 ? "text-rose" : "text-ink"}`}>{c.roas}x</Td>
                    <Td right><StatusBadge status={c.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="AI Recommendations" metric="roas"
          action={<span className="text-xs text-faint">Pause · Scale · Improve · Recover</span>}>
          <div className="grid gap-3 lg:grid-cols-2">
            {marketingRecs.length === 0 ? (
              <p className="col-span-2 py-6 text-center text-sm text-muted">All marketing recommendations actioned 🎉</p>
            ) : (
              marketingRecs.map((r) => <RecommendationCard key={r.id} rec={r} />)
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
