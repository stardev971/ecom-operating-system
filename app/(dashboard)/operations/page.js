"use client";

import { useState, useEffect } from "react";
import { Clock, Truck, Undo2, Headphones, AlertOctagon, ClipboardList, Search as SearchIcon, Warehouse, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import KpiCard from "@/components/KpiCard";
import { PageHeader, SectionCard, StatusBadge, Th, Td, Bar, ProviderLogo } from "@/components/ui";
import { Bars, MultiLine } from "@/components/Charts";
import Modal from "@/components/Modal";
import { PROVIDER_BY_ID } from "@/lib/integrations";
import { num, pct } from "@/lib/format";

export default function Operations() {
  const { data, toast } = useApp();
  const k = data.kpis;
  const o = data.operations;
  const [action, setAction] = useState(null);

  const supportBars = o.supportVolume.map((s) => ({ label: s.label, Tickets: s.tickets }));
  const returnLine = o.returnTrend.map((r) => ({ label: r.label, Rate: r.rate }));
  const fulfillLine = o.fulfillmentPerf.map((f) => ({ label: f.label, Hours: f.hours }));
  const maxWh = Math.max(...o.warehouses.map((w) => w.orders));

  const recentTickets = [...data.tickets].sort((a, b) => b.ts - a.ts).slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Operations Intelligence"
        subtitle="Monitor fulfillment speed, returns, and support load across the operation."
        icon={Truck}
        iconAccent="amber"
        live
        sources={["ShipStation", "Gorgias", "Shopify"]}
        actions={
          <>
            <button onClick={() => setAction("escalate")} className="btn-ghost"><AlertOctagon size={15} /> Escalate</button>
            <button onClick={() => setAction("task")} className="btn-soft"><ClipboardList size={15} /> Create Task</button>
            <button onClick={() => setAction("investigate")} className="btn-primary"><SearchIcon size={15} /> Investigate SKU</button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Avg Fulfillment Time" value={`${k.avgFulfillment}d`} delta={-4.0} icon={Clock} metric="fulfillmentTime" accent="emerald" />
        <KpiCard label="Shipping Delays" value={num(k.shippingDelays)} delta={3.2} deltaGood={false} icon={Truck} metric="fulfillmentTime" accent="amber" sub="last 30d" />
        <KpiCard label="Return Rate" value={pct(k.returnRate)} delta={1.1} deltaGood={false} icon={Undo2} metric="returnRate" accent="rose" />
        <KpiCard label="Open Support Tickets" value={num(k.openTickets)} delta={-8.0} icon={Headphones} metric="returnRate" accent="sky" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard title="Support Volume (14d)" metric="returnRate">
          <Bars data={supportBars} series={[{ key: "Tickets", name: "Tickets", color: "#38bdf8" }]} height={250} />
        </SectionCard>
        <SectionCard title="Return Trends" metric="returnRate">
          <MultiLine data={returnLine} series={[{ key: "Rate", name: "Return Rate %", color: "#fb7185" }]} fmt={(v) => `${v}%`} height={250} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard title="Fulfillment Performance (14d)" metric="fulfillmentTime">
          <MultiLine data={fulfillLine} series={[{ key: "Hours", name: "Hours to ship", color: "#6366f1" }]} fmt={(v) => `${v}h`} height={250} />
        </SectionCard>
        <SectionCard title="Warehouse Performance" metric="fulfillmentTime">
          <div className="space-y-4 py-1">
            {o.warehouses.map((w) => (
              <div key={w.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink"><Warehouse size={14} className="text-faint" /> {w.name}</span>
                  <span className="text-xs text-faint">{num(w.orders)} orders · {w.avgHours}h avg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bar value={w.orders} max={maxWh} color="#6366f1" />
                  <span className={`w-12 text-right text-xs font-semibold ${w.onTime >= 95 ? "text-emerald" : w.onTime >= 90 ? "text-amber" : "text-rose"}`}>{w.onTime}%</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Recent Support Tickets" metric="returnRate" pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <Th>Ticket</Th>
                  <Th>Subject</Th>
                  <Th>Channel</Th>
                  <Th>Priority</Th>
                  <Th right>Status</Th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-cardhover">
                    <Td className="font-mono text-xs text-faint">{t.id}</Td>
                    <Td className="text-ink">{t.subject}</Td>
                    <Td className="text-muted">{t.channel}</Td>
                    <Td><StatusBadge status={t.priority === "Urgent" ? "Error" : t.priority === "High" ? "Delayed" : t.priority === "Medium" ? "Open" : "Closed"} /></Td>
                    <Td right><StatusBadge status={t.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <OpsActionModal type={action} onClose={() => setAction(null)} toast={toast} products={data.products} />
    </div>
  );
}

function OpsActionModal({ type, onClose, toast, products }) {
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState("config");

  useEffect(() => {
    if (!type) return;
    setNote("");
    setPhase("config");
  }, [type]);

  if (!type) return null;
  const cfg = {
    escalate: { title: "Escalate Issue", icon: AlertOctagon, success: "Issue escalated to operations lead", ph: "Describe the issue to escalate…", integration: "slack" },
    task: { title: "Create Operations Task", icon: ClipboardList, success: "Operations task created", ph: "Task details…", integration: "slack" },
    investigate: { title: "Investigate SKU", icon: SearchIcon, success: "Investigation opened", ph: "What should be investigated?", integration: "gorgias" },
  }[type];

  const dest = PROVIDER_BY_ID[cfg.integration];
  const execute = () => { setPhase("running"); setTimeout(() => setPhase("done"), 1300); };
  const finish = () => { toast(cfg.success, { type: type === "escalate" ? "info" : "success" }); onClose(); };

  if (phase !== "config") {
    return (
      <Modal open={!!type} onClose={onClose} title={phase === "done" ? "Done" : cfg.title}
        subtitle={dest ? `Routes to ${dest.name}` : undefined}
        iconNode={dest ? <ProviderLogo name={dest.name} color={dest.color} size={36} rounded="rounded-lg" /> : undefined} icon={cfg.icon}
        footer={phase === "done" ? <button onClick={finish} className="btn-primary">Done</button> : <button disabled className="btn-primary opacity-70"><Loader2 size={15} className="animate-spin" /> Submitting…</button>}>
        {phase === "running" ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center"><Loader2 size={28} className="animate-spin text-brand-soft" /><p className="text-sm font-medium text-ink">Submitting to {dest?.name || "EOS"}…</p></div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center"><CheckCircle2 size={40} className="text-emerald" /><p className="text-sm font-medium text-ink">{cfg.success}</p><p className="text-xs text-muted">Logged to your audit trail.</p></div>
        )}
      </Modal>
    );
  }

  return (
    <Modal open={!!type} onClose={onClose} title={cfg.title} icon={cfg.icon}
      footer={<><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={execute} className="btn-primary">Submit</button></>}>
      <div className="space-y-4">
        {type === "investigate" && (
          <div>
            <label className="label">SKU</label>
            <select className="input mt-1.5">
              {products.slice(0, 20).map((p) => (
                <option key={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
        )}
        {(type === "task" || type === "escalate") && (
          <div>
            <label className="label">Assignee</label>
            <select className="input mt-1.5">
              <option>Operations Lead</option>
              <option>Fulfillment Manager</option>
              <option>Support Manager</option>
            </select>
          </div>
        )}
        <div>
          <label className="label">Notes</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={cfg.ph} rows={3} className="input mt-1.5 resize-none" />
        </div>
      </div>
    </Modal>
  );
}
