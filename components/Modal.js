"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, icon: Icon, iconNode, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fadein" onClick={onClose} />
      <div className={`relative z-10 w-full ${width} animate-scalein rounded-2xl border border-borderlight bg-card shadow-card`}>
        <div className="flex items-start gap-3 border-b border-border p-5">
          {iconNode
            ? iconNode
            : Icon && (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">
                  <Icon size={18} />
                </div>
              )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-faint hover:bg-cardhover hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border p-4">{footer}</div>}
      </div>
    </div>
  );
}
