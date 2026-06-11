"use client";

import { useState, useEffect } from "react";
import { PackageX, PackageOpen, Boxes, CalendarClock, ShoppingBag, TrendingDown, Megaphone, Zap, Rocket, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, ProductMark, Th, Td, ProviderLogo } from "@/components/ui";
import Modal from "@/components/Modal";
import { PROVIDER_BY_ID } from "@/lib/integrations";
import { usd, usdCompact, num } from "@/lib/format";

const TABS = [
  { id: "risk", label: "Products at Risk" },
  { id: "dead", label: "Dead Inventory" },
  { id: "fast", label: "Fast Movers" },
  { id: "slow", label: "Slow Movers" },
];

export default function Inventory() {
  const { data, toast } = useApp();
  const k = data.kpis;
  const [tab, setTab] = useState("risk");
  const [action, setAction] = useState(null); // {type, product}

  const rows =
    tab === "risk" ? data.stockoutRisk : tab === "dead" ? data.deadInventory : tab === "fast" ? data.fastMovers : data.slowMovers;

  return (
    <div>
      <PageHeader
        title="Inventory Intelligence"
        subtitle="Prevent stockouts and free up capital tied in excess inventory."
        icon={Boxes}
        iconAccent="sky"
        live
        sources={["Shopify", "Inventory Engine", "Supplier Data"]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Stockout Risk" value={`${data.stockoutRisk.length} SKUs`} icon={PackageX} metric="stockoutRisk" accent="rose" sub="within lead time" />
        <KpiCard label="Overstock Risk" value={`${data.deadInventory.length} SKUs`} icon={PackageOpen} metric="overstockRisk" accent="amber" sub=">180 days stock" />
        <KpiCard label="Inventory Value" value={usdCompact(k.inventoryValue)} icon={Boxes} metric="inventoryValue" accent="brand" />
        <KpiCard label="Avg Days of Inventory" value={`${Math.round(data.products.reduce((a, p) => a + Math.min(p.daysOfStock, 400), 0) / data.products.length)}d`} icon={CalendarClock} metric="daysOfInventory" accent="violet" />
      </div>

      <div className="mt-6">
        <SectionCard pad={false}
          title={
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.id ? "bg-brand/20 text-brand-soft" : "text-muted hover:text-ink"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        >
          <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-border bg-card">
                <tr>
                  <Th>Product</Th>
                  <Th right>In Stock</Th>
                  <Th right>Velocity</Th>
                  <Th right>Days Left</Th>
                  <Th right>Inv. Value</Th>
                  <Th right>Lead Time</Th>
                  <Th right>Action</Th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 30).map((p) => {
                  const isRisk = p.daysOfStock <= 21;
                  const isDead = p.daysOfStock > 180;
                  return (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-cardhover">
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <ProductMark name={p.name} size={30} />
                          <div>
                            <p className="font-medium text-ink">{p.name}</p>
                            <p className="text-[11px] text-faint">{p.sku} · {p.supplier}</p>
                          </div>
                        </div>
                      </Td>
                      <Td right className="text-muted">{num(p.stock)}</Td>
                      <Td right className="text-muted">{p.velocity}/d</Td>
                      <Td right className={`font-semibold ${isRisk ? "text-rose" : isDead ? "text-amber" : "text-ink"}`}>{p.daysOfStock}d</Td>
                      <Td right className="text-muted">{usdCompact(p.inventoryValue)}</Td>
                      <Td right className="text-muted">{p.leadTimeDays}d</Td>
                      <Td right>
                        {isDead ? (
                          <button onClick={() => setAction({ type: "clearance", product: p })} className="btn-ghost !px-2.5 !py-1 !text-xs">
                            <Megaphone size={13} /> Clearance
                          </button>
                        ) : isRisk ? (
                          <button onClick={() => setAction({ type: "po", product: p })} className="btn-primary !px-2.5 !py-1 !text-xs">
                            <ShoppingBag size={13} /> Reorder
                          </button>
                        ) : (
                          <button onClick={() => setAction({ type: "adspend", product: p })} className="btn-ghost !px-2.5 !py-1 !text-xs">
                            <TrendingDown size={13} /> Adjust
                          </button>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <ActionModal action={action} onClose={() => setAction(null)} toast={toast} />
    </div>
  );
}

function ActionModal({ action, onClose, toast }) {
  const [qty, setQty] = useState(0);
  const [discount, setDiscount] = useState(20);
  const [phase, setPhase] = useState("config"); // config | running | done

  useEffect(() => {
    if (!action) return;
    setQty(0);
    setDiscount(20);
    setPhase("config");
  }, [action]);

  if (!action) return null;
  const { type, product: p } = action;

  const cfg = {
    po: {
      title: "Create Purchase Order",
      icon: ShoppingBag,
      submit: "Submit Purchase Order",
      integration: "shopify",
      destLabel: "supplier",
    },
    clearance: {
      title: "Run Clearance Campaign",
      icon: Megaphone,
      submit: "Launch Clearance",
      integration: "klaviyo",
      destLabel: "channel",
    },
    adspend: {
      title: "Reduce Ad Spend",
      icon: TrendingDown,
      submit: "Apply Budget Change",
      integration: "meta",
      destLabel: "ad platform",
    },
  }[type];

  const dest = PROVIDER_BY_ID[cfg.integration];
  const suggestedQty = Math.max(50, Math.round(p.velocity * (p.leadTimeDays + 30)));

  const summary =
    type === "po" ? `PO for ${num(qty || suggestedQty)} units submitted to ${p.supplier}`
    : type === "clearance" ? `${discount}% clearance launched via ${dest.name}`
    : `Ad spend on ${p.name} reduced in ${dest.name}`;

  const execute = () => { setPhase("running"); setTimeout(() => setPhase("done"), 1400); };
  const finish = () => { toast(summary, { detail: p.name, type: type === "clearance" ? "automation" : "success" }); onClose(); };

  if (phase !== "config") {
    return (
      <Modal open={!!action} onClose={onClose}
        title={phase === "done" ? "Action executed" : cfg.title}
        subtitle={phase === "done" ? summary : `${p.name} · ${p.sku}`}
        iconNode={<ProviderLogo name={dest.name} color={dest.color} size={36} rounded="rounded-lg" />}
        footer={phase === "done" ? <button onClick={finish} className="btn-primary">Done</button> : <button disabled className="btn-primary opacity-70"><Loader2 size={15} className="animate-spin" /> Executing…</button>}>
        {phase === "running" ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand-soft"><cfg.icon size={18} /></div><ArrowRight size={16} className="text-faint" /><ProviderLogo name={dest.name} color={dest.color} size={40} /></div>
            <Loader2 size={28} className="animate-spin text-brand-soft" />
            <p className="text-sm font-medium text-ink">Sending to {type === "po" ? p.supplier : dest.name}…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 size={40} className="text-emerald" />
            <p className="text-sm font-medium text-ink">{summary}</p>
            <p className="text-xs text-muted">Confirmed and logged to your audit trail.</p>
          </div>
        )}
      </Modal>
    );
  }

  return (
    <Modal open={!!action} onClose={onClose} title={cfg.title} subtitle={`${p.name} · ${p.sku}`} icon={cfg.icon}
      footer={<><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={execute} className="btn-primary"><Zap size={15} /> {cfg.submit}</button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Mini label="In Stock" value={num(p.stock)} />
          <Mini label="Velocity" value={`${p.velocity}/d`} />
          <Mini label="Days Left" value={`${p.daysOfStock}d`} />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-panel px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <ProviderLogo name={dest.name} color={dest.color} size={28} rounded="rounded-md" />
            <div><p className="text-sm font-medium text-ink">{type === "po" ? p.supplier : dest.name}</p><p className="text-[11px] text-faint">Destination {cfg.destLabel}</p></div>
          </div>
          <span className="chip bg-emerald/15 text-emerald"><CheckCircle2 size={12} /> Connected</span>
        </div>

        {type === "po" && (
          <>
            <div>
              <label className="label">Reorder Quantity</label>
              <input type="number" defaultValue={suggestedQty} onChange={(e) => setQty(+e.target.value)} className="input mt-1.5" />
              <p className="mt-1 text-xs text-faint">Suggested {num(suggestedQty)} units to cover lead time + 30 days at current velocity.</p>
            </div>
            <div className="rounded-lg border border-border bg-panel p-3 text-sm">
              <div className="flex justify-between text-muted"><span>Supplier</span><span className="text-ink">{p.supplier}</span></div>
              <div className="mt-1 flex justify-between text-muted"><span>Est. cost</span><span className="text-ink">{usd((qty || suggestedQty) * p.cost)}</span></div>
              <div className="mt-1 flex justify-between text-muted"><span>Lead time</span><span className="text-ink">{p.leadTimeDays} days</span></div>
            </div>
          </>
        )}

        {type === "clearance" && (
          <>
            <div>
              <label className="label">Discount %</label>
              <input type="range" min="10" max="60" defaultValue={20} onChange={(e) => setDiscount(+e.target.value)} className="mt-2 w-full accent-brand" />
              <div className="mt-1 flex justify-between text-xs text-faint"><span>10%</span><span className="font-semibold text-brand-soft">{discount}% off</span><span>60%</span></div>
            </div>
            <div className="rounded-lg border border-border bg-panel p-3 text-sm">
              <div className="flex justify-between text-muted"><span>Capital tied up</span><span className="text-ink">{usd(p.inventoryValue)}</span></div>
              <div className="mt-1 flex justify-between text-muted"><span>Projected recovery</span><span className="text-emerald">{usd(p.inventoryValue * (1 - discount / 100) * 0.8)}</span></div>
            </div>
          </>
        )}

        {type === "adspend" && (
          <div className="rounded-lg border border-border bg-panel p-3 text-sm">
            <p className="text-muted">Current ad spend on this SKU is <span className="text-ink">{usd(p.adSpend30d)}</span>/30d. Recommend reducing by 40% to align spend with healthy inventory levels.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <p className="label mb-1 text-faint">{label}</p>
      <p className="text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
