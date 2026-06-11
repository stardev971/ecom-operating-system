"use client";

import { useState, useEffect } from "react";
import { Repeat, DollarSign, UserMinus, Crown, Gift, Megaphone, RotateCcw, Star, Loader2, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, Avatar, Th, Td, ProviderLogo } from "@/components/ui";
import { MultiLine, Donut } from "@/components/Charts";
import Modal from "@/components/Modal";
import { PROVIDER_BY_ID } from "@/lib/integrations";
import { usd, usdCompact, num, pct } from "@/lib/format";

export default function Customers() {
  const { data, toast } = useApp();
  const k = data.kpis;
  const [campaign, setCampaign] = useState(null);

  const segDonut = data.segmentArr.map((s, i) => ({ name: s.name, value: s.count, color: ["#6366f1", "#34d399", "#fbbf24", "#fb7185", "#64748b"][i] }));
  const repeatTrend = data.repeatTrend.map((r) => ({ label: r.label, Rate: r.rate }));
  const sentiment = [
    { name: "Positive", value: data.reviews.sentiment.Positive, color: "#34d399" },
    { name: "Neutral", value: data.reviews.sentiment.Neutral, color: "#fbbf24" },
    { name: "Negative", value: data.reviews.sentiment.Negative, color: "#fb7185" },
  ];

  const heatColor = (v) => {
    if (v === null || v === undefined) return "bg-transparent text-faint";
    if (v >= 70) return "bg-brand text-white";
    if (v >= 45) return "bg-brand/60 text-white";
    if (v >= 25) return "bg-brand/35 text-ink";
    if (v >= 12) return "bg-brand/20 text-muted";
    return "bg-brand/10 text-faint";
  };

  return (
    <div>
      <PageHeader
        title="Customer Intelligence"
        subtitle="Understand customer health, loyalty, and lifetime value."
        icon={Repeat}
        iconAccent="emerald"
        live
        sources={["Shopify", "Klaviyo", "Gorgias", "Yotpo"]}
        actions={
          <>
            <button onClick={() => setCampaign("retention")} className="btn-ghost"><Megaphone size={15} /> Retention</button>
            <button onClick={() => setCampaign("vip")} className="btn-soft"><Gift size={15} /> VIP Offer</button>
            <button onClick={() => setCampaign("winback")} className="btn-primary"><RotateCcw size={15} /> Win-back</button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Repeat Purchase Rate" value={pct(k.repeatRate)} delta={2.8} icon={Repeat} metric="repeatRate" accent="emerald" />
        <KpiCard label="Avg Lifetime Value" value={usd(k.ltv)} delta={4.4} icon={DollarSign} metric="ltv" accent="brand" />
        <KpiCard label="Churn Risk" value={num(k.churnRiskCount)} delta={6.0} deltaGood={false} icon={UserMinus} metric="churnRisk" accent="rose" sub="customers" />
        <KpiCard label="VIP Customers" value={num(data.vipCustomers.length > 0 ? data.segmentArr.find((s) => s.name === "VIP").count : 0)} delta={5.5} icon={Crown} metric="ltv" accent="amber" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Customer Segments" metric="repeatRate">
          <Donut data={segDonut} fmt={num} height={250} />
        </SectionCard>
        <SectionCard title="Repeat Purchase Trend" metric="repeatRate" className="lg:col-span-2">
          <MultiLine data={repeatTrend} series={[{ key: "Rate", name: "Repeat Rate %", color: "#34d399" }]} fmt={(v) => `${v}%`} height={250} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Cohort Retention" metric="churnRisk" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="text-faint">
                  <th className="px-2 py-2 text-left font-medium">Cohort</th>
                  <th className="px-2 py-2 font-medium">Size</th>
                  {[0, 1, 2, 3, 4, 5].map((m) => (
                    <th key={m} className="px-2 py-2 font-medium">M{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cohort.map((row) => (
                  <tr key={row.cohort}>
                    <td className="px-2 py-1.5 text-left text-muted">{row.cohort}</td>
                    <td className="px-2 py-1.5 text-muted">{num(row.size)}</td>
                    {[0, 1, 2, 3, 4, 5].map((m) => (
                      <td key={m} className="px-1 py-1">
                        <div className={`mx-auto grid h-8 place-items-center rounded ${heatColor(row[`m${m}`])}`}>
                          {row[`m${m}`] === null ? "" : `${row[`m${m}`]}%`}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="Review Sentiment" metric="churnRisk">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <Star size={16} className="text-amber" fill="currentColor" />
            <span className="text-lg font-bold text-ink">{data.reviews.avgRating}</span>
            <span className="text-xs text-faint">avg · {num(data.reviews.sentiment.Positive + data.reviews.sentiment.Neutral + data.reviews.sentiment.Negative)} reviews</span>
          </div>
          <Donut data={sentiment} fmt={num} height={190} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <CustomerTable title="VIP Customers" rows={data.vipCustomers} metric="ltv" accent="text-amber" />
        <CustomerTable title="At-Risk Customers" rows={data.atRiskCustomers} metric="churnRisk" accent="text-rose" showRisk />
        <CustomerTable title="High-Value Customers" rows={data.highValue} metric="ltv" accent="text-emerald" />
      </div>

      <CampaignModal type={campaign} onClose={() => setCampaign(null)} toast={toast} data={data} />
    </div>
  );
}

function CustomerTable({ title, rows, metric, accent, showRisk }) {
  return (
    <SectionCard title={title} metric={metric} pad={false}>
      <div className="max-h-[360px] overflow-y-auto">
        {rows.map((c) => (
          <div key={c.id} className="flex items-center gap-3 border-b border-border/50 px-5 py-2.5 last:border-0 hover:bg-cardhover">
            <Avatar name={c.name} size={30} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{c.name}</p>
              <p className="text-[11px] text-faint">{c.orders} orders · {c.city}</p>
            </div>
            <span className={`text-sm font-semibold ${accent}`}>
              {showRisk ? `${c.churnRisk}%` : usdCompact(c.spent)}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

const SEQUENCES = {
  klaviyo: ["Win-back 90-day", "Lapsed VIP Re-engagement", "Browse Abandonment", "Post-Purchase Nurture"],
  hubspot_mkt: ["Win-back Outreach", "Re-engagement Drip", "VIP Reactivation"],
  attentive: ["SMS Win-back Journey", "Replenishment Reminder", "VIP Early Access SMS"],
};

function CampaignModal({ type, onClose, toast, data }) {
  const { isConnected } = useApp();
  const [tool, setTool] = useState("klaviyo");
  const [seq, setSeq] = useState(SEQUENCES.klaviyo[0]);
  const [channel, setChannel] = useState("Email + SMS");
  const [phase, setPhase] = useState("config"); // config | running | done

  useEffect(() => {
    if (!type) return;
    setTool("klaviyo");
    setSeq(SEQUENCES.klaviyo[0]);
    setChannel("Email + SMS");
    setPhase("config");
  }, [type]);

  if (!type) return null;

  const cfg = {
    retention: { title: "Launch Retention Campaign", icon: Megaphone, audience: data.atRiskCustomers.length * 12, desc: "Email + SMS sequence targeting customers with declining engagement.", noun: "Retention sequence" },
    vip: { title: "Create VIP Offer", icon: Gift, audience: data.segmentArr.find((s) => s.name === "VIP").count, desc: "Exclusive early-access offer for your highest-value customers.", noun: "VIP offer" },
    winback: { title: "Trigger Win-back Campaign", icon: RotateCcw, audience: data.segmentArr.find((s) => s.name === "Churned").count, desc: "Automated win-back flow with escalating incentives over 30 days.", noun: "Win-back sequence" },
  }[type];

  const dest = PROVIDER_BY_ID[tool];
  const summary = `“${seq}” started in ${dest.name} · ${channel}`;

  const execute = () => { setPhase("running"); setTimeout(() => setPhase("done"), 1500); };
  const finish = () => { toast(summary, { detail: `${num(cfg.audience)} customers targeted`, type: "automation" }); onClose(); };

  return (
    <Modal open={!!type} onClose={onClose}
      title={phase === "done" ? "Sequence started" : cfg.title}
      subtitle={phase === "done" ? summary : `Routes to ${dest.name}`}
      iconNode={<ProviderLogo name={dest.name} color={dest.color} size={36} rounded="rounded-lg" />}
      footer={
        phase === "done" ? (
          <button onClick={finish} className="btn-primary">Done</button>
        ) : phase === "running" ? (
          <button disabled className="btn-primary opacity-70"><Loader2 size={15} className="animate-spin" /> Starting sequence…</button>
        ) : (
          <><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={execute} className="btn-primary"><Zap size={15} /> Start in {dest.name}</button></>
        )
      }>
      {phase === "done" ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <CheckCircle2 size={40} className="text-emerald" />
            <p className="text-sm font-medium text-ink">{summary}</p>
            <p className="text-xs text-muted">{num(cfg.audience)} customers enrolled · confirmed by {dest.name}.</p>
          </div>
          <div className="rounded-lg border border-emerald/30 bg-emerald/10 p-3">
            <p className="label mb-1 text-emerald">Est. recovered LTV</p>
            <p className="text-lg font-bold text-ink">{usdCompact(cfg.audience * 42)}</p>
          </div>
        </div>
      ) : phase === "running" ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand-soft"><cfg.icon size={18} /></div><ArrowRight size={16} className="text-faint" /><ProviderLogo name={dest.name} color={dest.color} size={40} /></div>
          <Loader2 size={28} className="animate-spin text-brand-soft" />
          <p className="text-sm font-medium text-ink">Enrolling {num(cfg.audience)} customers in {dest.name}…</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">{cfg.desc}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-panel p-3"><p className="label mb-1 text-faint">Target Audience</p><p className="text-lg font-bold text-ink">{num(cfg.audience)}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="label mb-1 text-faint">Est. Recovered LTV</p><p className="text-lg font-bold text-emerald">{usdCompact(cfg.audience * 42)}</p></div>
          </div>
          <div>
            <label className="label">Run through</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {["klaviyo", "hubspot_mkt", "attentive"].map((t) => {
                const p = PROVIDER_BY_ID[t];
                return (
                  <button key={t} onClick={() => { setTool(t); setSeq(SEQUENCES[t][0]); }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${tool === t ? "border-brand bg-brand/10 text-ink" : "border-border text-muted hover:text-ink"}`}>
                    <ProviderLogo name={p.name} color={p.color} size={20} rounded="rounded-md" /> {p.name}
                  </button>
                );
              })}
            </div>
            {!isConnected(tool) && <p className="mt-1.5 text-[11px] text-amber">{dest.name} isn’t connected yet — connect it in Integrations to go live.</p>}
          </div>
          <div>
            <label className="label">{tool === "hubspot_mkt" ? "Sequence" : "Flow"}</label>
            <select value={seq} onChange={(e) => setSeq(e.target.value)} className="input mt-1.5">
              {SEQUENCES[tool].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Channel</label>
            <div className="mt-1.5 flex gap-2">
              {["Email", "SMS", "Email + SMS"].map((c) => (
                <button key={c} onClick={() => setChannel(c)} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${channel === c ? "border-brand bg-brand/10 text-ink" : "border-border text-muted hover:text-ink"}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
