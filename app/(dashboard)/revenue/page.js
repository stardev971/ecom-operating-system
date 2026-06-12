"use client";

import { useState } from "react";
import { DollarSign, Receipt, Percent, Wallet, TrendingDown, AlertTriangle, Package } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, ProductMark, Th, Td } from "@/components/ui";
import { Bars, Donut } from "@/components/Charts";
import Modal from "@/components/Modal";
import { usd, usdCompact, num, pct } from "@/lib/format";

export default function Revenue() {
  const { data, metrics, rangeLabel, range } = useApp();
  const k = metrics;
  const [active, setActive] = useState(null);

  const byCollection = data.profitByCollection.map((c) => ({ label: c.name, Profit: c.profit, Revenue: c.revenue }));
  const byChannel = data.profitByChannel.map((c) => ({ name: c.name.split(" ")[0], value: c.profit, color: c.color }));
  const products = [...data.products].sort((a, b) => b.revenue - a.revenue);
  const revenueAtRisk = data.stockoutRisk.reduce((a, p) => a + p.revenue * 0.16, 0);

  return (
    <div>
      <PageHeader
        title="Revenue & Profit Intelligence"
        subtitle={`True profitability after COGS and ad spend — by product, collection, and channel. ${range}.`}
        icon={DollarSign}
        iconAccent="brand"
        live
        sources={["Shopify", "Ad Platforms", "QuickBooks"]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label={`Revenue (${rangeLabel})`} value={usdCompact(k.revenue30)} delta={k.revChange} icon={DollarSign} metric="revenue" accent="brand" />
        <KpiCard label="COGS" value={usdCompact(k.cogs30)} delta={5.1} deltaGood={false} icon={Receipt} metric="grossProfit" accent="rose" />
        <KpiCard label="Gross Margin" value={pct(k.grossMargin)} delta={1.2} icon={Percent} metric="grossMargin" accent="emerald" />
        <KpiCard label="Net Margin" value={pct(k.netMargin)} delta={-0.6} icon={Wallet} metric="netMargin" accent="violet" />
        <KpiCard label="Revenue at Risk" value={usdCompact(revenueAtRisk)} icon={AlertTriangle} metric="revenueAtRisk" accent="amber" sub={`${data.stockoutRisk.length} SKUs`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard title="Profit by Collection" metric="grossMargin" className="lg:col-span-2">
          <Bars
            data={byCollection}
            series={[
              { key: "Revenue", name: "Revenue", color: "#94a3b8" },
              { key: "Profit", name: "Gross Profit", color: "#6366f1" },
            ]}
            fmt={usdCompact}
            height={280}
          />
        </SectionCard>
        <SectionCard title="Profit by Channel" metric="profitByChannel">
          <Donut data={byChannel} fmt={usdCompact} height={280} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Profit by product */}
        <SectionCard title="Profit by Product" metric="grossMargin" className="lg:col-span-2" pad={false}>
          <div className="max-h-[460px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-border bg-card">
                <tr>
                  <Th>Product</Th>
                  <Th right>Revenue</Th>
                  <Th right>Ad Spend</Th>
                  <Th right>Margin</Th>
                  <Th right>Net</Th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 30).map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setActive(p)}
                    className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-cardhover"
                  >
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <ProductMark name={p.name} size={30} />
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-[11px] text-faint">{p.category}</p>
                        </div>
                      </div>
                    </Td>
                    <Td right className="text-muted">{usdCompact(p.revenue)}</Td>
                    <Td right className="text-muted">{usdCompact(p.adSpend30d)}</Td>
                    <Td right className="font-medium text-ink">{pct(p.realMargin, 0)}</Td>
                    <Td right className={p.netAfterAds < 0 ? "font-semibold text-rose" : "font-semibold text-emerald"}>
                      {usdCompact(p.netAfterAds)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Loss makers */}
        <SectionCard title="Loss-Making Products" metric="netMargin" pad={false}>
          <div className="max-h-[460px] overflow-y-auto">
            {data.lossMakers.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted">No products are losing money. 🎉</p>
            ) : (
              data.lossMakers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="flex w-full items-center gap-3 border-b border-border/50 px-5 py-3 text-left last:border-0 hover:bg-cardhover"
                >
                  <TrendingDown size={16} className="shrink-0 text-rose" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-[11px] text-faint">Ad spend {usd(p.adSpend30d)}</p>
                  </div>
                  <span className="text-sm font-semibold text-rose">{usd(p.netAfterAds)}</span>
                </button>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <ProductDrilldown product={active} onClose={() => setActive(null)} />
    </div>
  );
}

function ProductDrilldown({ product, onClose }) {
  if (!product) return null;
  const p = product;
  const losing = p.netAfterAds < 0;
  const rec = losing
    ? `Reduce ad spend or raise price. At ${pct(p.realMargin, 0)} margin the current ${usd(p.adSpend30d)} ad spend pushes this SKU below break-even.`
    : `Healthy contributor. Margin of ${pct(p.realMargin, 0)} supports scaling spend — consider a +20% budget test.`;

  return (
    <Modal open={!!product} onClose={onClose} title={p.name} subtitle={`${p.sku} · ${p.category} · ${p.collection}`} icon={Package} size="lg"
      footer={<button onClick={onClose} className="btn-primary">Close</button>}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Revenue" value={usd(p.revenue)} />
        <Stat label="Cost (COGS)" value={usd(p.cogs)} />
        <Stat label="Ad Spend (30d)" value={usd(p.adSpend30d)} />
        <Stat label="Gross Margin" value={pct(p.realMargin, 0)} tint="text-emerald" />
        <Stat label="Net After Ads" value={usd(p.netAfterAds)} tint={losing ? "text-rose" : "text-emerald"} />
        <Stat label="Units Sold" value={num(p.unitsSold)} />
        <Stat label="Price" value={usd(p.price, { cents: true })} />
        <Stat label="In Stock" value={num(p.stock)} />
        <Stat label="Days of Stock" value={`${p.daysOfStock}d`} />
      </div>
      <div className="mt-4 rounded-lg border border-brand/30 bg-brand/10 p-4">
        <p className="label mb-1 text-brand-soft">AI Recommendation</p>
        <p className="text-sm leading-relaxed text-ink">{rec}</p>
      </div>
    </Modal>
  );
}

function Stat({ label, value, tint = "text-ink" }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <p className="label mb-1 text-faint">{label}</p>
      <p className={`text-base font-semibold ${tint}`}>{value}</p>
    </div>
  );
}
