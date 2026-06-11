"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Megaphone, TrendingUp, ShoppingBag, Tag, RotateCcw, Search as SearchIcon, DollarSign,
  Zap, Loader2, CheckCircle2, Plug, ArrowRight, Check,
} from "lucide-react";
import Modal from "./Modal";
import { ProviderLogo } from "./ui";
import { useApp } from "./Providers";
import { PROVIDER_BY_ID } from "@/lib/integrations";

/* ------------------------------------------------------------------ *
 * ActionFlowModal — turns an AI recommendation into a realistic,
 * integration-routed action. Three phases: config → running → done.
 * The config form (and the destination integration) is chosen from
 * the recommendation's action verb so each action feels like it is
 * executing against the real connected system.
 * ------------------------------------------------------------------ */

// realistic lists "pulled" from each connected tool
const FLOWS = {
  klaviyo: ["Win-back 90-day", "Lapsed VIP Re-engagement", "Browse Abandonment", "Post-Purchase Nurture", "Sunset Re-permission"],
  hubspot_mkt: ["Win-back Outreach", "Re-engagement Drip", "VIP Reactivation", "Dormant Customer Sequence"],
  attentive: ["SMS Win-back Journey", "Replenishment Reminder", "VIP Early Access SMS"],
};
const SUPPLIERS = ["Shenzhen Apex", "Lin Manufacturing", "NorthBay Goods", "Atlas Supply Co.", "Meridian Works", "Pacific Source"];
const ASSIGNEES = ["Operations Lead", "Fulfillment Manager", "Quality Team", "Merchandising Lead"];

function platformFromTitle(title = "") {
  if (/tiktok/i.test(title)) return "tiktok";
  if (/google/i.test(title)) return "google_ads";
  if (/email|klaviyo/i.test(title)) return "klaviyo";
  if (/meta|facebook|instagram/i.test(title)) return "meta";
  return "meta";
}

// resolve action verb → flow config
function resolveConfig(rec) {
  const action = rec.action || "";
  switch (action) {
    case "Pause Campaign":
      return { kind: "pauseCampaign", icon: Megaphone, integration: platformFromTitle(rec.title), verb: "Pause Campaign", run: "Pause Campaign" };
    case "Scale Campaign":
      return { kind: "scaleCampaign", icon: TrendingUp, integration: platformFromTitle(rec.title), verb: "Scale Campaign", run: "Apply New Budget" };
    case "Create Purchase Order":
      return { kind: "purchaseOrder", icon: ShoppingBag, integration: "shopify", verb: "Create Purchase Order", run: "Submit Purchase Order" };
    case "Run Clearance Campaign":
      return { kind: "clearance", icon: Tag, integration: "klaviyo", verb: "Run Clearance Campaign", run: "Launch Clearance" };
    case "Trigger Win-back Campaign":
      return { kind: "winback", icon: RotateCcw, integration: "klaviyo", verb: "Trigger Win-back Campaign", run: "Start Sequence" };
    case "Investigate SKU":
      return { kind: "investigate", icon: SearchIcon, integration: "gorgias", verb: "Investigate SKU", run: "Open Investigation" };
    default:
      return { kind: "pricing", icon: DollarSign, integration: "quickbooks", verb: action || "Review", run: "Create Review Task" };
  }
}

export default function ActionFlowModal({ rec, mode = "approve", onClose, onComplete }) {
  const { isConnected, toast } = useApp();
  const cfg = useMemo(() => (rec ? resolveConfig(rec) : null), [rec]);
  const provider = cfg ? PROVIDER_BY_ID[cfg.integration] : null;

  const [phase, setPhase] = useState("config"); // config | running | done
  // form state
  const [tool, setTool] = useState(cfg?.integration || "klaviyo");
  const [flow, setFlow] = useState("");
  const [channel, setChannel] = useState("Email");
  const [budget, setBudget] = useState(30);
  const [discount, setDiscount] = useState(25);
  const [qty, setQty] = useState(0);
  const [supplier, setSupplier] = useState(SUPPLIERS[0]);
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [note, setNote] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (!rec || !cfg) return;
    setPhase("config");
    setTool(cfg.integration);
    setFlow((FLOWS[cfg.integration] || FLOWS.klaviyo)[0]);
    setChannel("Email");
    setBudget(30);
    setDiscount(25);
    setQty(0);
    setSupplier(SUPPLIERS[0]);
    setAssignee(ASSIGNEES[0]);
    setNote("");
    setNewPrice("");
  }, [rec, cfg]);

  if (!rec || !cfg) return null;

  const dest = PROVIDER_BY_ID[tool] || provider;
  const automate = mode === "automate";

  const summary = () => {
    switch (cfg.kind) {
      case "winback": return `Started “${flow}” in ${dest?.name} · ${channel}`;
      case "pauseCampaign": return `Campaign paused in ${dest?.name}`;
      case "scaleCampaign": return `Budget increased ${budget}% in ${dest?.name}`;
      case "purchaseOrder": return `PO submitted to ${supplier}`;
      case "clearance": return `${discount}% clearance launched via ${dest?.name}`;
      case "investigate": return `Investigation assigned to ${assignee}`;
      default: return `Pricing review task created`;
    }
  };

  const execute = () => {
    setPhase("running");
    setTimeout(() => setPhase("done"), 1500);
  };

  const finish = () => {
    onComplete?.(automate ? "automated" : "approved", summary());
    onClose();
  };

  const RunIcon = automate ? Zap : Check;

  return (
    <Modal
      open={!!rec}
      onClose={onClose}
      title={phase === "done" ? "Action executed" : cfg.verb}
      subtitle={phase === "done" ? summary() : `${rec.module} · routes to ${dest?.name || "EOS"}`}
      iconNode={
        dest ? <ProviderLogo name={dest.name} color={dest.color} size={36} rounded="rounded-lg" /> : undefined
      }
      icon={cfg.icon}
      size="lg"
      footer={
        phase === "done" ? (
          <button onClick={finish} className="btn-primary">Done</button>
        ) : phase === "running" ? (
          <button disabled className="btn-primary opacity-70"><Loader2 size={15} className="animate-spin" /> Executing…</button>
        ) : (
          <>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={execute} className="btn-primary"><RunIcon size={15} /> {cfg.run}</button>
          </>
        )
      }
    >
      {phase === "done" ? (
        <DoneView summary={summary()} dest={dest} rec={rec} />
      ) : phase === "running" ? (
        <RunningView dest={dest} cfg={cfg} />
      ) : (
        <div className="space-y-4">
          {automate && (
            <div className="flex items-center gap-2 rounded-lg border border-violet/30 bg-violet/10 p-3 text-xs text-violet">
              <Zap size={14} /> Autopilot mode — EOS will execute this automatically once confirmed.
            </div>
          )}

          <div className="rounded-lg border border-border bg-panel p-3">
            <p className="text-sm font-medium text-ink">{rec.title}</p>
            <p className="mt-1 text-xs text-muted">{rec.detail}</p>
            <p className="mt-1.5 text-xs font-medium text-emerald">↑ {rec.impact}</p>
          </div>

          <DestinationRow dest={dest} connected={isConnected(tool)} />

          {/* ----- per-action configuration ----- */}
          {cfg.kind === "winback" && (
            <>
              <Field label="Run through">
                <div className="flex flex-wrap gap-2">
                  {["klaviyo", "hubspot_mkt", "attentive"].map((t) => {
                    const p = PROVIDER_BY_ID[t];
                    const on = tool === t;
                    return (
                      <button key={t} onClick={() => { setTool(t); setFlow((FLOWS[t] || [])[0]); }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${on ? "border-brand bg-brand/10 text-ink" : "border-border text-muted hover:text-ink"}`}>
                        <ProviderLogo name={p.name} color={p.color} size={20} rounded="rounded-md" />
                        {p.name}{!isConnected(t) && <span className="text-[10px] text-amber">· connect</span>}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label={`${dest?.name} ${tool === "hubspot_mkt" ? "sequence" : "flow"}`}>
                <select value={flow} onChange={(e) => setFlow(e.target.value)} className="input">
                  {(FLOWS[tool] || []).map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Channel">
                <div className="flex gap-2">
                  {["Email", "SMS", "Email + SMS"].map((c) => (
                    <button key={c} onClick={() => setChannel(c)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${channel === c ? "border-brand bg-brand/10 text-ink" : "border-border text-muted hover:text-ink"}`}>{c}</button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {cfg.kind === "pauseCampaign" && (
            <div className="rounded-lg border border-border bg-panel p-3 text-sm text-muted">
              This will pause the underperforming campaign directly in <span className="text-ink">{dest?.name}</span>. Spend stops immediately; the campaign can be resumed anytime.
            </div>
          )}

          {cfg.kind === "scaleCampaign" && (
            <Field label={`Budget increase — +${budget}%`}>
              <input type="range" min="10" max="100" value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full accent-brand" />
              <div className="mt-1 flex justify-between text-[11px] text-faint"><span>+10%</span><span className="font-semibold text-brand-soft">+{budget}% daily budget</span><span>+100%</span></div>
            </Field>
          )}

          {cfg.kind === "purchaseOrder" && (
            <>
              <Field label="Supplier">
                <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="input">
                  {SUPPLIERS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Reorder quantity">
                <input type="number" value={qty || ""} placeholder="e.g. 500" onChange={(e) => setQty(+e.target.value)} className="input" />
              </Field>
            </>
          )}

          {cfg.kind === "clearance" && (
            <>
              <Field label="Run through">
                <div className="flex flex-wrap gap-2">
                  {["klaviyo", "meta", "shopify"].map((t) => {
                    const p = PROVIDER_BY_ID[t];
                    return (
                      <button key={t} onClick={() => setTool(t)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${tool === t ? "border-brand bg-brand/10 text-ink" : "border-border text-muted hover:text-ink"}`}>
                        <ProviderLogo name={p.name} color={p.color} size={20} rounded="rounded-md" /> {p.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label={`Discount — ${discount}% off`}>
                <input type="range" min="10" max="60" value={discount} onChange={(e) => setDiscount(+e.target.value)} className="w-full accent-brand" />
              </Field>
            </>
          )}

          {cfg.kind === "investigate" && (
            <>
              <Field label="Assign to">
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="input">
                  {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Notes">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="What should be investigated?" className="input resize-none" />
              </Field>
            </>
          )}

          {cfg.kind === "pricing" && (
            <>
              <div className="rounded-lg border border-border bg-panel p-3 text-sm text-muted">{rec.detail}</div>
              <Field label="Proposed new price (optional)">
                <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="$0.00" className="input" />
              </Field>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function DestinationRow({ dest, connected }) {
  if (!dest) return null;
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-panel px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <ProviderLogo name={dest.name} color={dest.color} size={28} rounded="rounded-md" />
        <div>
          <p className="text-sm font-medium text-ink">{dest.name}</p>
          <p className="text-[11px] text-faint">Destination system</p>
        </div>
      </div>
      <span className={`chip ${connected ? "bg-emerald/15 text-emerald" : "bg-amber/15 text-amber"}`}>
        {connected ? <><CheckCircle2 size={12} /> Connected</> : <><Plug size={12} /> Connect to run</>}
      </span>
    </div>
  );
}

function RunningView({ dest, cfg }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand-soft"><cfg.icon size={18} /></div>
        <ArrowRight size={16} className="text-faint" />
        {dest && <ProviderLogo name={dest.name} color={dest.color} size={40} />}
      </div>
      <Loader2 size={28} className="animate-spin text-brand-soft" />
      <p className="text-sm font-medium text-ink">Sending to {dest?.name || "EOS"}…</p>
      <p className="text-xs text-muted">Executing the action and confirming with the connected system.</p>
    </div>
  );
}

function DoneView({ summary, dest, rec }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <CheckCircle2 size={40} className="text-emerald" />
        <p className="text-sm font-medium text-ink">{summary}</p>
        <p className="text-xs text-muted">Confirmed by {dest?.name || "EOS"} · logged to your audit trail.</p>
      </div>
      <div className="rounded-lg border border-emerald/30 bg-emerald/10 p-3">
        <p className="label mb-1 text-emerald">Projected impact</p>
        <p className="text-sm font-semibold text-ink">{rec.impact}</p>
      </div>
    </div>
  );
}
