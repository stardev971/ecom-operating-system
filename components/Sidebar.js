"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  Megaphone,
  Boxes,
  Users,
  Truck,
  Sparkles,
  Cable,
  Cpu,
  FileText,
  Settings,
  LifeBuoy,
  Activity,
  CalendarCheck,
  ArrowRight,
  X,
} from "lucide-react";
import { useApp } from "./Providers";

const MODULES = [
  { href: "/overview", label: "Executive Overview", icon: LayoutDashboard },
  { href: "/revenue", label: "Revenue & Profit", icon: DollarSign },
  { href: "/marketing", label: "Marketing Intelligence", icon: Megaphone },
  { href: "/inventory", label: "Inventory Intelligence", icon: Boxes },
  { href: "/customers", label: "Customer Intelligence", icon: Users },
  { href: "/operations", label: "Operations Intelligence", icon: Truck },
  { href: "/ai-center", label: "AI Action Center", icon: Sparkles, badge: true },
];

const PLATFORM = [
  { href: "/integrations", label: "Integrations", icon: Cable },
  { href: "/ai-usage", label: "AI Usage", icon: Cpu },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { data, recStatus, connectedIntegrations } = useApp();
  const connected = connectedIntegrations.filter((i) => i.status === "Connected").length;
  const pendingRecs = data.recommendations.filter((r) => (recStatus[r.id] || "pending") === "pending").length;

  const Item = ({ href, label, icon: Icon, badge }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
          active ? "bg-brand/15 text-ink" : "text-muted hover:bg-cardhover hover:text-ink"
        }`}
      >
        <Icon size={17} className={active ? "text-brand-soft" : "text-faint group-hover:text-muted"} />
        <span className="flex-1 truncate font-medium">{label}</span>
        {badge && pendingRecs > 0 && (
          <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-rose px-1 text-[11px] font-bold text-white">
            {pendingRecs}
          </span>
        )}
        {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />}
      </Link>
    );
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-panel transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/overview" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet shadow-glow">
              <Activity size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Ecom OS</p>
              <p className="text-[11px] text-faint">Operating System</p>
            </div>
          </Link>
          <button className="text-faint hover:text-ink md:hidden" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-faint">
            Intelligence Modules
          </p>
          <div className="space-y-0.5">
            {MODULES.map((m) => (
              <Item key={m.href} {...m} />
            ))}
          </div>

          <p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-wider text-faint">Platform</p>
          <div className="space-y-0.5">
            {PLATFORM.map((m) => (
              <Item key={m.href} {...m} />
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          {/* Build-your-own CTA */}
          <a
            href="https://meetings-na2.hubspot.com/jay-sonavani"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-brand/30 bg-gradient-to-br from-brand/15 to-violet/15 p-3 transition-colors hover:border-brand/50"
          >
            <p className="text-sm font-semibold text-ink">Want a system like this?</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              Book a free call with our experts to build your own Operating System.
            </p>
            <span className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-brand to-violet px-3 py-2 text-sm font-semibold text-white shadow-glow transition-transform group-hover:scale-[1.02]">
              <CalendarCheck size={15} />
              Talk to an Expert
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>

          <Link
            href="/settings"
            onClick={onClose}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-cardhover hover:text-ink"
          >
            <LifeBuoy size={17} className="text-faint" />
            <span className="font-medium">Help & Support</span>
          </Link>

          <div className="mt-2 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">Connected Platforms</span>
              <span className="text-xs font-bold text-emerald">{connected} live</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {connectedIntegrations.slice(0, 16).map((i) => (
                <span
                  key={i.id}
                  title={`${i.name} — ${i.status}`}
                  className={`h-2 w-2 rounded-full ${
                    i.status === "Connected" ? "bg-emerald" : i.status === "Syncing" ? "bg-sky animate-pulsedot" : i.status === "Error" ? "bg-rose" : "bg-faint"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
