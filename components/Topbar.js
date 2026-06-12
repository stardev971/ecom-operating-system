"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Bell, Menu, Package, User, Megaphone, Sparkles, ChevronDown, LogOut,
  Settings as SettingsIcon, Building2, CalendarDays, Check,
} from "lucide-react";
import { useApp } from "./Providers";
import { Avatar } from "./ui";
import { searchAll } from "@/lib/search";
import { clearAuth } from "@/lib/auth";

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];

export default function Topbar({ onMenu }) {
  const router = useRouter();
  const { data, notifications, unread, markAllRead, markRead, recStatus, range, setRange, toast } = useApp();
  const [q, setQ] = useState("");
  const [panel, setPanel] = useState(null); // 'search' | 'notif' | 'user' | 'range'
  const wrapRef = useRef(null);

  const pendingRecs = data.recommendations.filter((r) => (recStatus[r.id] || "pending") === "pending").length;

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setPanel(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = q.trim().length > 1 ? searchAll(data, q, 6) : [];
  const RESULT_ICON = { product: Package, customer: User, campaign: Megaphone, recommendation: Sparkles };

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setPanel(null);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header ref={wrapRef} className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur md:px-6">
      <button className="text-muted hover:text-ink md:hidden" onClick={onMenu} aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* Company switcher */}
      <button className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm hover:bg-cardhover lg:flex">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/15 text-brand-soft"><Building2 size={14} /></span>
        <span className="font-medium text-ink">Northwind Co.</span>
        <ChevronDown size={14} className="text-faint" />
      </button>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <form onSubmit={submit}>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPanel("search");
            }}
            onFocus={() => setPanel("search")}
            placeholder="Search customers, insights…"
            className="input !py-2 !pl-9 !pr-9"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 text-[11px] text-faint sm:block">/</span>
        </form>

        {panel === "search" && results.length > 0 && (
          <div className="absolute left-0 right-0 top-12 z-50 animate-fadein overflow-hidden rounded-xl border border-borderlight bg-card shadow-card">
            {results.map((r) => {
              const Icon = RESULT_ICON[r.type] || Search;
              return (
                <button
                  key={r.type + r.id}
                  onClick={() => {
                    setPanel(null);
                    setQ("");
                    router.push(r.href);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-cardhover"
                >
                  <Icon size={15} className="text-faint" />
                  <span className="flex-1 truncate text-sm text-ink">{r.label}</span>
                  <span className="text-[11px] uppercase tracking-wide text-faint">{r.type}</span>
                </button>
              );
            })}
            <button onClick={submit} className="w-full border-t border-border px-4 py-2.5 text-left text-xs font-medium text-brand-soft hover:bg-cardhover">
              See all results for “{q}”
            </button>
          </div>
        )}
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Date range */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setPanel(panel === "range" ? null : "range")}
            className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-sm text-muted hover:bg-cardhover hover:text-ink"
          >
            <CalendarDays size={15} className="text-faint" />
            <span className="hidden font-medium md:inline">{range}</span>
            <ChevronDown size={14} className="text-faint" />
          </button>
          {panel === "range" && (
            <div className="absolute right-0 top-11 z-50 w-44 animate-fadein overflow-hidden rounded-xl border border-borderlight bg-card shadow-card">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setPanel(null); if (r !== range) toast(`Dashboard updated — ${r}`, { type: "info" }); }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-muted hover:bg-cardhover hover:text-ink"
                >
                  {r} {range === r && <Check size={14} className="text-brand-soft" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Action Center quick link */}
        <Link
          href="/ai-center"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-brand-soft hover:bg-cardhover"
          aria-label="AI Action Center"
        >
          <Sparkles size={17} />
          {pendingRecs > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              {pendingRecs > 99 ? "99" : pendingRecs}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setPanel(panel === "notif" ? null : "notif")}
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted hover:bg-cardhover hover:text-ink"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {panel === "notif" && (
            <div className="absolute right-0 top-11 z-50 w-80 animate-fadein overflow-hidden rounded-xl border border-borderlight bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold text-ink">Notifications</span>
                <button onClick={markAllRead} className="text-xs font-medium text-brand-soft hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className="flex w-full gap-3 border-b border-border/60 px-4 py-3 text-left hover:bg-cardhover"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-brand-soft"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${n.read ? "text-muted" : "text-ink"}`}>{n.title}</p>
                      <p className="mt-0.5 text-[11px] capitalize text-faint">{n.type} · {n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="mx-1 hidden h-7 w-px bg-border sm:block" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setPanel(panel === "user" ? null : "user")}
            className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-1.5 hover:bg-cardhover sm:pr-2"
          >
            <Avatar name="Alex Morgan" size={32} />
            <div className="hidden text-left leading-tight lg:block">
              <p className="text-sm font-semibold text-ink">Alex Morgan</p>
              <p className="text-[11px] text-faint">Chief Executive Officer</p>
            </div>
            <ChevronDown size={14} className="text-faint" />
          </button>
          {panel === "user" && (
            <div className="absolute right-0 top-12 z-50 w-56 animate-fadein overflow-hidden rounded-xl border border-borderlight bg-card shadow-card">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Avatar name="Alex Morgan" size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">Alex Morgan</p>
                  <p className="truncate text-xs text-faint">ceo@ecomos.com</p>
                </div>
              </div>
              <Link href="/settings" onClick={() => setPanel(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-cardhover hover:text-ink">
                <SettingsIcon size={15} /> Settings
              </Link>
              <Link href="/settings" onClick={() => setPanel(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-cardhover hover:text-ink">
                <User size={15} /> Profile
              </Link>
              <button
                onClick={() => { clearAuth(); setPanel(null); router.push("/"); }}
                className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-left text-sm text-rose hover:bg-cardhover"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
