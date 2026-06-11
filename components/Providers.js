"use client";

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { getDataset, computeWindow, RANGE_DAYS, RANGE_LABEL } from "@/lib/data";
import { ALL_PROVIDERS } from "@/lib/integrations";
import { CheckCircle2, XCircle, Info, Zap, X } from "lucide-react";

const AppCtx = createContext(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

let toastSeq = 0;

export function AppProvider({ children }) {
  const data = useMemo(() => getDataset(), []);

  // recommendation lifecycle state (persists across navigation)
  const [recStatus, setRecStatus] = useState({});
  const updateRec = useCallback((id, status) => {
    setRecStatus((s) => ({ ...s, [id]: status }));
  }, []);

  // global date range (top bar) → drives windowed metrics across dashboards
  const [range, setRange] = useState("Last 30 days");
  const rangeDays = RANGE_DAYS[range] || 30;
  const rangeLabel = RANGE_LABEL[range] || "30d";
  const win = useMemo(() => computeWindow(rangeDays), [rangeDays]);
  const metrics = win.kpis;

  // notifications
  const [notifications, setNotifications] = useState(() => buildNotifications(data));
  const unread = notifications.filter((n) => !n.read).length;
  const markRead = useCallback((id) => {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }, []);

  // toasts
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, opts = {}) => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, message, type: opts.type || "success", detail: opts.detail }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 4200);
  }, []);
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  // ---- integration connection state (persists across navigation) ----
  // Seeded from the runtime dataset; every other catalog provider starts
  // "Not Connected" and can be connected through the Connect modal.
  const [integrationState, setIntegrationState] = useState(() => {
    const map = {};
    const seeded = Object.fromEntries(data.integrations.map((i) => [i.id, i]));
    ALL_PROVIDERS.forEach((p) => {
      const s = seeded[p.id];
      map[p.id] = s
        ? { status: s.status, lastSync: s.lastSync, recordsSynced: s.recordsSynced, health: s.health }
        : { status: "Not Connected", lastSync: "—", recordsSynced: 0, health: 0 };
    });
    return map;
  });

  const connectIntegration = useCallback((id) => {
    setIntegrationState((m) => ({
      ...m,
      [id]: { status: "Connected", lastSync: "Just now", recordsSynced: 1200 + Math.floor(Math.random() * 8000), health: 100 },
    }));
  }, []);
  const disconnectIntegration = useCallback((id) => {
    setIntegrationState((m) => ({
      ...m,
      [id]: { status: "Not Connected", lastSync: "—", recordsSynced: 0, health: 0 },
    }));
  }, []);
  const syncIntegration = useCallback((id) => {
    setIntegrationState((m) => ({ ...m, [id]: { ...m[id], lastSync: "Just now", health: Math.max(96, m[id]?.health || 96) } }));
  }, []);
  const isConnected = useCallback((id) => integrationState[id]?.status === "Connected", [integrationState]);

  // merged provider + runtime for connected (and syncing/error) integrations
  const connectedIntegrations = useMemo(
    () =>
      ALL_PROVIDERS.filter((p) => (integrationState[p.id]?.status || "Not Connected") !== "Not Connected").map((p) => ({
        ...p,
        ...integrationState[p.id],
      })),
    [integrationState]
  );

  const value = {
    data,
    recStatus,
    updateRec,
    notifications,
    unread,
    markRead,
    markAllRead,
    toast,
    // date range + windowed metrics
    range,
    setRange,
    rangeDays,
    rangeLabel,
    metrics,
    channelRev: win.channelRev,
    trend: win.dailyArr,
    // integrations
    integrationState,
    connectedIntegrations,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    isConnected,
  };

  return (
    <AppCtx.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismissToast} />
    </AppCtx.Provider>
  );
}

function buildNotifications(data) {
  const out = [];
  const crit = data.recommendations.filter((r) => r.priority === "Critical").slice(0, 3);
  crit.forEach((r) =>
    out.push({ id: `n_${out.length}`, type: r.module.toLowerCase(), title: r.title, time: "12m ago", read: false })
  );
  out.push({ id: `n_${out.length}`, type: "inventory", title: `${data.stockoutRisk.length} SKUs flagged for stockout risk`, time: "38m ago", read: false });
  out.push({ id: `n_${out.length}`, type: "marketing", title: `Email campaigns generated $${Math.round(data.marketing.channelCompare.find((c) => c.id === "email")?.revenue / 1000 || 82)}K`, time: "1h ago", read: false });
  out.push({ id: `n_${out.length}`, type: "support", title: `${data.operations.openTickets} support tickets need attention`, time: "2h ago", read: true });
  out.push({ id: `n_${out.length}`, type: "ai", title: `${data.recommendations.length} new AI recommendations generated`, time: "3h ago", read: true });
  return out;
}

function ToastViewport({ toasts, dismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[360px] flex-col gap-3">
      {toasts.map((t) => {
        const Icon = t.type === "error" ? XCircle : t.type === "info" ? Info : t.type === "automation" ? Zap : CheckCircle2;
        const tint =
          t.type === "error" ? "text-rose" : t.type === "info" ? "text-sky" : t.type === "automation" ? "text-violet" : "text-emerald";
        return (
          <div
            key={t.id}
            className="pointer-events-auto animate-fadein rounded-xl border border-borderlight bg-card p-3.5 shadow-card"
          >
            <div className="flex items-start gap-3">
              <Icon size={18} className={`mt-0.5 shrink-0 ${tint}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{t.message}</p>
                {t.detail && <p className="mt-0.5 text-xs text-muted">{t.detail}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="text-faint hover:text-ink">
                <X size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
