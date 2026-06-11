"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Info } from "lucide-react";
import { getMetric } from "@/lib/metrics";

const SOURCE_DOT = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

/* Info icon that opens an anchored popover explaining a cross-system metric
   (source systems, calculation logic, business meaning) — spec §17. */
export default function InfoTooltip({ metric, className = "" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const m = getMetric(metric);

  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const W = 320;
    const left = Math.min(Math.max(12, r.left), window.innerWidth - W - 12);
    let top = r.bottom + 8;
    // flip above if not enough room below
    if (top + 240 > window.innerHeight) top = Math.max(12, r.top - 248);
    setPos({ top, left });
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    if (!open) place();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target) && !btnRef.current.contains(e.target)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!m) return null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`About ${m.name}`}
        onClick={toggle}
        className={`grid h-4 w-4 place-items-center rounded-full transition-colors ${open ? "text-brand-soft" : "text-faint hover:text-brand-soft"} ${className}`}
      >
        <Info size={14} />
      </button>

      {open && (
        <div
          ref={popRef}
          onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: 320, zIndex: 80 }}
          className="animate-fadein rounded-xl border border-borderlight bg-card p-4 shadow-card"
        >
          <p className="text-sm font-semibold text-ink">{m.name} — How it&apos;s calculated</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{m.logic}</p>

          <div className="mt-3 space-y-1.5">
            {m.sources.map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SOURCE_DOT[i % SOURCE_DOT.length] }} />
                <span className="font-medium text-ink">{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-border pt-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-faint">What it means</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{m.meaning}</p>
          </div>
        </div>
      )}
    </>
  );
}
