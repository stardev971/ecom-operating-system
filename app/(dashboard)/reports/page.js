"use client";

import { useState } from "react";
import { FileText, Download, FileSpreadsheet, CalendarClock, DollarSign, Megaphone, Boxes, Users, Truck, LayoutDashboard, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import { PageHeader, SectionCard } from "@/components/ui";
import Modal from "@/components/Modal";

const REPORTS = [
  { id: "exec", name: "Executive Summary", icon: LayoutDashboard, desc: "Top-line KPIs, insights, and trends across the whole operation.", sources: ["All systems"] },
  { id: "profit", name: "Profitability Report", icon: DollarSign, desc: "Revenue, COGS, margins, and net profit by product and channel.", sources: ["Shopify", "QuickBooks", "Ads"] },
  { id: "marketing", name: "Marketing Performance", icon: Megaphone, desc: "ROAS, CAC, LTV, and campaign breakdowns across all channels.", sources: ["Meta", "Google", "TikTok", "Klaviyo"] },
  { id: "inventory", name: "Inventory Health", icon: Boxes, desc: "Stockout risk, dead inventory, and reorder recommendations.", sources: ["Shopify", "Inventory Engine"] },
  { id: "customer", name: "Customer Health", icon: Users, desc: "Retention, churn risk, segments, and lifetime value.", sources: ["Shopify", "Klaviyo", "Yotpo"] },
  { id: "ops", name: "Operations Report", icon: Truck, desc: "Fulfillment speed, returns, and support performance.", sources: ["ShipStation", "Gorgias"] },
];

export default function Reports() {
  const { toast } = useApp();
  const [busy, setBusy] = useState(null); // `${id}:${type}`
  const [schedule, setSchedule] = useState(null);

  const run = (report, type) => {
    const key = `${report.id}:${type}`;
    setBusy(key);
    setTimeout(() => {
      setBusy(null);
      toast(`${report.name} ${type === "pdf" ? "PDF generated" : "CSV exported"}`, {
        detail: type === "pdf" ? "Downloaded to your device" : "Export ready",
        type: "success",
      });
    }, 1400);
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Prebuilt executive reports — generate, export, or schedule delivery." icon={FileText} iconAccent="emerald" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="card card-pad flex flex-col">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand-soft">
                <r.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{r.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{r.desc}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.sources.map((s) => (
                <span key={s} className="chip border border-border bg-panel text-[11px] text-faint">{s}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <button onClick={() => run(r, "pdf")} disabled={busy} className="btn-primary !py-1.5 !text-xs">
                {busy === `${r.id}:pdf` ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} Generate PDF
              </button>
              <button onClick={() => run(r, "csv")} disabled={busy} className="btn-soft !py-1.5 !text-xs">
                {busy === `${r.id}:csv` ? <Loader2 size={13} className="animate-spin" /> : <FileSpreadsheet size={13} />} Export CSV
              </button>
              <button onClick={() => setSchedule(r)} className="btn-ghost !py-1.5 !text-xs">
                <CalendarClock size={13} /> Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <ScheduleModal report={schedule} onClose={() => setSchedule(null)} toast={toast} />
    </div>
  );
}

function ScheduleModal({ report, onClose, toast }) {
  const [freq, setFreq] = useState("Weekly");
  const [day, setDay] = useState("Monday");
  if (!report) return null;
  return (
    <Modal open={!!report} onClose={onClose} title={`Schedule: ${report.name}`} icon={CalendarClock}
      footer={<><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={() => { toast("Report scheduled", { detail: `${report.name} · ${freq}`, type: "success" }); onClose(); }} className="btn-primary"><CheckCircle2 size={15} /> Schedule Report</button></>}>
      <div className="space-y-4">
        <div>
          <label className="label">Frequency</label>
          <div className="mt-1.5 flex gap-2">
            {["Daily", "Weekly", "Monthly"].map((f) => (
              <button key={f} onClick={() => setFreq(f)} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${freq === f ? "border-brand bg-brand/15 text-ink" : "border-border text-muted hover:text-ink"}`}>{f}</button>
            ))}
          </div>
        </div>
        {freq === "Weekly" && (
          <div>
            <label className="label">Day of week</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="input mt-1.5">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="label">Deliver to</label>
          <input defaultValue="ceo@ecomos.com, leadership@ecomos.com" className="input mt-1.5" />
        </div>
        <div>
          <label className="label">Format</label>
          <div className="mt-1.5 flex gap-2">
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked className="accent-brand" /> PDF</label>
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" className="accent-brand" /> CSV</label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
