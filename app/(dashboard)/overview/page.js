"use client";

import Link from "next/link";
import { DollarSign, TrendingUp, Megaphone, Wallet, ShoppingCart, Repeat, ArrowRight, Boxes, Sparkles, AlertTriangle, Mail, BarChart3 } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, ProductMark, StatusBadge } from "@/components/ui";
import { AreaTrend, Donut, Bars } from "@/components/Charts";
import RecommendationCard from "@/components/RecommendationCard";
import { usd, usdCompact, num, pct } from "@/lib/format";

const dlabel = (ts) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Overview() {
  const { data, recStatus, metrics, channelRev, trend: trendDaily, rangeLabel, range } = useApp();
  const k = metrics;

  const trend = trendDaily.map((d) => ({ label: dlabel(d.ts), Revenue: d.revenue, Profit: d.profit }));
  const channelDonut = [
    { name: "Meta", value: channelRev.meta, color: "#6366f1" },
    { name: "Google", value: channelRev.google, color: "#38bdf8" },
    { name: "Email", value: channelRev.email, color: "#34d399" },
    { name: "Organic", value: channelRev.organic, color: "#fbbf24" },
    { name: "TikTok", value: channelRev.tiktok, color: "#fb7185" },
    { name: "Direct", value: channelRev.direct, color: "#a78bfa" },
  ];
  const segDonut = data.segmentArr.map((s, i) => ({ name: s.name, value: s.count, color: ["#6366f1", "#34d399", "#fbbf24", "#fb7185", "#64748b"][i] }));
  const topProducts = data.topProducts.slice(0, 6).map((p) => ({ label: p.name.length > 16 ? p.name.slice(0, 15) + "…" : p.name, Revenue: p.revenue }));
  const emailRev = data.marketing.channelCompare.find((c) => c.id === "email")?.revenue || 0;

  const insights = [
    { icon: TrendingUp, tint: "text-emerald", text: `Revenue ${k.revChange >= 0 ? "increased" : "decreased"} ${Math.abs(k.revChange)}% vs the prior 30 days.` },
    { icon: AlertTriangle, tint: "text-amber", text: `Inventory risk detected on ${data.stockoutRisk.length} SKUs projected to stock out within 21 days.` },
    { icon: Mail, tint: "text-sky", text: `Email campaigns generated ${usdCompact(emailRev)} in attributed revenue.` },
    { icon: Megaphone, tint: "text-rose", text: `Customer acquisition cost is ${usd(k.cac)} at a blended ${k.roas}x ROAS.` },
  ];

  const pendingRecs = data.recommendations.filter((r) => (recStatus[r.id] || "pending") === "pending").slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Executive Overview"
        subtitle={`Your command center — every connected system in one picture. ${range}.`}
        icon={BarChart3}
        iconAccent="brand"
        actions={
          <Link href="/reports" className="btn-soft">
            <BarChart3 size={15} /> Generate Report
          </Link>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label={`Revenue (${rangeLabel})`} value={usdCompact(k.revenue30)} delta={k.revChange} icon={DollarSign} metric="revenue" accent="brand" />
        <KpiCard label="Gross Profit" value={usdCompact(k.grossProfit30)} delta={6.4} icon={TrendingUp} metric="grossProfit" accent="emerald" sub={pct(k.grossMargin) + " margin"} />
        <KpiCard label="Marketing Spend" value={usdCompact(k.marketingSpend)} delta={12.1} deltaGood={false} icon={Megaphone} metric="marketingSpend" accent="rose" />
        <KpiCard label="Net Profit" value={usdCompact(k.netProfit30)} delta={4.2} icon={Wallet} metric="netProfit" accent="violet" sub={pct(k.netMargin) + " margin"} />
        <KpiCard label="Orders" value={num(k.orders30)} delta={9.3} icon={ShoppingCart} metric="orders" accent="sky" sub={usd(k.aov30) + " AOV"} />
        <KpiCard label="Returning Customers" value={pct(k.returningPct)} delta={2.8} icon={Repeat} metric="returningPct" accent="amber" />
      </div>

      {/* Insights */}
      <div className="mt-6">
        <SectionCard title="Executive Insights" metric="netProfit">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {insights.map((ins, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-border bg-panel p-3.5">
                <ins.icon size={18} className={`mt-0.5 shrink-0 ${ins.tint}`} />
                <p className="text-sm leading-relaxed text-muted">{ins.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue & Profit Trend" metric="revenue" className="lg:col-span-2">
          <AreaTrend
            data={trend}
            series={[
              { key: "Revenue", name: "Revenue", color: "#6366f1" },
              { key: "Profit", name: "Gross Profit", color: "#34d399" },
            ]}
            fmt={usdCompact}
            height={280}
          />
        </SectionCard>
        <SectionCard title="Revenue Breakdown" metric="profitByChannel">
          <Donut data={channelDonut} fmt={usdCompact} height={280} />
        </SectionCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Customer Segmentation" metric="repeatRate">
          <Donut data={segDonut} fmt={num} height={260} />
        </SectionCard>
        <SectionCard title="Top Products by Revenue" className="lg:col-span-2" action={<Link href="/revenue" className="text-xs font-medium text-brand-soft hover:underline">View all →</Link>}>
          <Bars data={topProducts} series={[{ key: "Revenue", name: "Revenue", color: "#6366f1" }]} layout="vertical" fmt={usdCompact} height={260} />
        </SectionCard>
      </div>

      {/* Inventory risk + AI recs */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Inventory Risk" metric="stockoutRisk" className="lg:col-span-2" pad={false}
          action={<Link href="/inventory" className="text-xs font-medium text-brand-soft hover:underline">Inventory →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-faint">Product</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-faint">In Stock</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-faint">Days Left</th>
                  <th className="px-5 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-faint">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.stockoutRisk.slice(0, 6).map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <ProductMark name={p.name} size={30} />
                        <div>
                          <p className="text-sm font-medium text-ink">{p.name}</p>
                          <p className="text-[11px] text-faint">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-muted">{num(p.stock)}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-ink">{p.daysOfStock}d</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={p.daysOfStock < 7 ? "Error" : p.daysOfStock < 14 ? "Delayed" : "Open"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="AI Recommendations" metric="netProfit"
          action={<Link href="/ai-center" className="inline-flex items-center gap-1 text-xs font-medium text-brand-soft hover:underline">Action Center <ArrowRight size={12} /></Link>}>
          <div className="space-y-3">
            {pendingRecs.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">All recommendations actioned 🎉</p>
            ) : (
              pendingRecs.map((r) => <RecommendationCard key={r.id} rec={r} compact />)
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
