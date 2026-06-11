"use client";

import { useState } from "react";
import { Check, X, Eye, Zap, CheckCircle2, Boxes, Megaphone, Users, Truck, DollarSign } from "lucide-react";
import { useApp } from "./Providers";
import { PriorityBadge } from "./ui";
import Modal from "./Modal";
import ActionFlowModal from "./ActionFlowModal";

const MODULE_ICON = {
  Inventory: Boxes,
  Marketing: Megaphone,
  Customer: Users,
  Operations: Truck,
  Revenue: DollarSign,
};

export default function RecommendationCard({ rec, compact = false }) {
  const { recStatus, updateRec, toast } = useApp();
  const status = recStatus[rec.id] || "pending";
  const [details, setDetails] = useState(false);
  const [flow, setFlow] = useState(null); // "approve" | "automate"
  const Icon = MODULE_ICON[rec.module] || Zap;

  const resolved = status !== "pending";
  const verb =
    status === "approved" ? "Approved" : status === "dismissed" ? "Dismissed" : status === "automated" ? "Automation running" : "";

  const onApprove = () => setFlow("approve");
  const onAutomate = () => setFlow("automate");
  const onReject = () => {
    updateRec(rec.id, "dismissed");
    toast("Recommendation dismissed", { detail: rec.title, type: "info" });
  };
  const onFlowComplete = (resultStatus, summary) => {
    updateRec(rec.id, resultStatus);
    toast(summary || `${rec.action} executed`, {
      detail: rec.title,
      type: resultStatus === "automated" ? "automation" : "success",
    });
  };

  return (
    <>
      <div className={`card transition-colors ${resolved ? "opacity-70" : "hover:border-borderlight"}`}>
        <div className="flex gap-3.5 p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">
            <Icon size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={rec.priority} />
              <span className="text-xs text-faint">{rec.module} · {rec.type}</span>
            </div>
            <h4 className="mt-1.5 text-sm font-semibold text-ink">{rec.title}</h4>
            {!compact && <p className="mt-1 text-sm leading-relaxed text-muted">{rec.detail}</p>}
            <p className="mt-1.5 text-xs font-medium text-emerald">↑ {rec.impact}</p>

            {resolved ? (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-panel px-3 py-1.5 text-xs font-medium text-emerald">
                <CheckCircle2 size={14} /> {verb}
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button onClick={onApprove} className="btn-primary !py-1.5 !text-xs">
                  <Check size={14} /> Approve
                </button>
                <button onClick={onAutomate} className="btn-soft !py-1.5 !text-xs">
                  <Zap size={14} /> Run Automation
                </button>
                <button onClick={() => setDetails(true)} className="btn-ghost !py-1.5 !text-xs">
                  <Eye size={14} /> View Details
                </button>
                <button onClick={onReject} className="btn-ghost !py-1.5 !text-xs">
                  <X size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={details}
        onClose={() => setDetails(false)}
        title={rec.title}
        subtitle={`${rec.module} · ${rec.type}`}
        icon={Icon}
        footer={
          <>
            <button onClick={() => setDetails(false)} className="btn-ghost">Close</button>
            {!resolved && (
              <button
                onClick={() => {
                  setDetails(false);
                  setFlow("approve");
                }}
                className="btn-primary"
              >
                <Check size={15} /> Approve {rec.action}
              </button>
            )}
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={rec.priority} />
          </div>
          <p className="text-sm leading-relaxed text-muted">{rec.detail}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Recommended Action" value={rec.action} />
            <Field label="Projected Impact" value={rec.impact} tint="text-emerald" />
          </div>
          <div className="rounded-lg border border-border bg-panel p-3">
            <p className="label mb-1 text-faint">How this was generated</p>
            <p className="text-sm text-muted">
              EOS evaluated connected data across {rec.module} sources, scored the signal against historical
              benchmarks, and surfaced this as <span className="text-ink">{rec.priority.toLowerCase()}</span> priority.
            </p>
          </div>
        </div>
      </Modal>

      {flow && (
        <ActionFlowModal
          rec={rec}
          mode={flow}
          onClose={() => setFlow(null)}
          onComplete={onFlowComplete}
        />
      )}
    </>
  );
}

function Field({ label, value, tint = "text-ink" }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <p className="label mb-1 text-faint">{label}</p>
      <p className={`text-sm font-semibold ${tint}`}>{value}</p>
    </div>
  );
}
