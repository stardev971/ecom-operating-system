"use client";

import { useMemo, useState } from "react";
import { Cable, RefreshCw, Plus, Activity, CheckCircle2, Database, Search, Lock, Link2, Unplug, AlertTriangle } from "lucide-react";
import { useApp } from "@/components/Providers";
import { PageHeader, SectionCard, StatusBadge, ProviderLogo } from "@/components/ui";
import Modal from "@/components/Modal";
import ConnectModal from "@/components/ConnectModal";
import { CATALOG, CATEGORY_TABS, PROVIDER_BY_ID, authLabel } from "@/lib/integrations";
import { num } from "@/lib/format";

export default function Integrations() {
  const { connectedIntegrations, integrationState, toast, syncIntegration } = useApp();
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [connectTarget, setConnectTarget] = useState(null); // provider to connect
  const [manageTarget, setManageTarget] = useState(null); // connected integration to manage

  const counts = {
    Connected: connectedIntegrations.filter((i) => i.status === "Connected").length,
    Syncing: connectedIntegrations.filter((i) => i.status === "Syncing").length,
    Error: connectedIntegrations.filter((i) => i.status === "Error").length,
  };
  const totalRecords = connectedIntegrations.reduce((a, i) => a + (i.recordsSynced || 0), 0);

  const q = query.trim().toLowerCase();
  const visibleCategories = useMemo(() => {
    return CATALOG.filter((c) => cat === "all" || c.key === cat)
      .map((c) => ({
        ...c,
        providers: c.providers.filter(
          (p) => !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        ),
      }))
      .filter((c) => c.providers.length > 0);
  }, [cat, q]);

  const statusOf = (id) => integrationState[id]?.status || "Not Connected";

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connect the tools your store already runs on. Every source feeds your operating system."
        icon={Cable}
        iconAccent="sky"
        actions={
          <button onClick={() => toast("Sync started across all sources", { type: "info" })} className="btn-soft">
            <RefreshCw size={15} /> Sync All
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="Connected" value={counts.Connected} tint="text-emerald" />
        <Tile label="Syncing" value={counts.Syncing} tint="text-sky" />
        <Tile label="Errors" value={counts.Error} tint="text-rose" />
        <Tile label="Records Synced" value={num(totalRecords)} tint="text-brand-soft" small />
      </div>

      {/* Connected */}
      <div className="mt-6">
        <SectionCard title={`Connected Integrations (${connectedIntegrations.length})`} pad={false}>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {connectedIntegrations.map((i) => (
              <button key={i.id} onClick={() => setManageTarget(i)} className="bg-card p-4 text-left transition-colors hover:bg-cardhover">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ProviderLogo name={i.name} color={i.color} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{i.name}</p>
                      <p className="text-[11px] text-faint">{i.categoryName}</p>
                    </div>
                  </div>
                  <StatusBadge status={i.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
                  <span>Last sync: {i.lastSync}</span>
                  <span className={i.health >= 90 ? "text-emerald" : i.health >= 60 ? "text-amber" : "text-rose"}>{i.health}% health</span>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Catalog */}
      <div className="mt-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-base font-semibold text-ink">Add an Integration</h2>
          <div className="relative w-full lg:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search integrations…"
              className="input pl-9"
            />
          </div>
        </div>

        {/* category tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setCat(t.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                cat === t.key ? "bg-brand text-white" : "border border-border text-muted hover:text-ink"
              }`}
            >
              {t.name}{t.count ? ` (${t.count})` : ""}
            </button>
          ))}
        </div>

        {visibleCategories.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 py-16 text-center">
            <Search size={28} className="text-faint" />
            <p className="text-sm font-medium text-ink">No integrations match “{query}”</p>
            <p className="text-xs text-muted">Try a different search or category.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {visibleCategories.map((c) => (
              <div key={c.key}>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-ink">{c.name}</h3>
                  <p className="text-xs text-faint">{c.blurb}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {c.providers.map((p) => {
                    const connected = statusOf(p.id) === "Connected";
                    const errored = statusOf(p.id) === "Error";
                    return (
                      <div key={p.id} className="card card-pad flex flex-col">
                        <div className="flex items-start gap-3">
                          <ProviderLogo name={p.name} color={p.color} size={40} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                              {p.popular && <span className="chip bg-amber/15 px-1.5 py-0.5 text-[10px] text-amber">Popular</span>}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-faint">{p.desc}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                          <span className="flex items-center gap-1.5 text-[11px] text-faint">
                            <Lock size={11} /> {authLabel(p.auth)}
                          </span>
                          {connected ? (
                            <button onClick={() => setManageTarget({ ...p, ...integrationState[p.id], categoryName: c.name })} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald">
                              <CheckCircle2 size={13} /> Connected
                            </button>
                          ) : errored ? (
                            <button onClick={() => setConnectTarget(p)} className="btn-ghost !px-2.5 !py-1.5 !text-xs !text-rose">
                              <AlertTriangle size={13} /> Reconnect
                            </button>
                          ) : (
                            <button onClick={() => setConnectTarget(p)} className="btn-ghost !px-2.5 !py-1.5 !text-xs">
                              <Link2 size={13} /> Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConnectModal provider={connectTarget} onClose={() => setConnectTarget(null)} />
      <ManageModal
        integration={manageTarget}
        onClose={() => setManageTarget(null)}
        toast={toast}
        syncIntegration={syncIntegration}
        onReconnect={(p) => {
          setManageTarget(null);
          setConnectTarget(PROVIDER_BY_ID[p.id]);
        }}
      />
    </div>
  );
}

function Tile({ label, value, tint, small }) {
  return (
    <div className="card card-pad">
      <span className="text-sm text-muted">{label}</span>
      <p className={`mt-2 font-bold text-ink ${small ? "text-xl" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function ManageModal({ integration, onClose, toast, syncIntegration, onReconnect }) {
  const { disconnectIntegration } = useApp();
  if (!integration) return null;
  const i = integration;
  const erroredState = i.status === "Error";

  return (
    <Modal
      open={!!integration}
      onClose={onClose}
      title={i.name}
      subtitle={`${i.categoryName} · ${authLabel(i.auth)}`}
      iconNode={<ProviderLogo name={i.name} color={i.color} size={36} rounded="rounded-lg" />}
      size="lg"
      footer={
        <>
          <button
            onClick={() => {
              disconnectIntegration(i.id);
              toast(`${i.name} disconnected`, { type: "info" });
              onClose();
            }}
            className="btn-ghost !text-rose"
          >
            <Unplug size={14} /> Disconnect
          </button>
          {erroredState ? (
            <button onClick={() => onReconnect(i)} className="btn-primary"><Link2 size={14} /> Reconnect</button>
          ) : (
            <button onClick={() => { syncIntegration(i.id); toast(`${i.name} sync started`, { type: "info" }); }} className="btn-primary">
              <RefreshCw size={14} /> Sync now
            </button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={i.status} />
          <span className="text-xs text-faint">Last sync {i.lastSync}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Database} label="Records Synced" value={num(i.recordsSynced)} />
          <Stat icon={Activity} label="Health Status" value={`${i.health}%`} tint={i.health >= 90 ? "text-emerald" : i.health >= 60 ? "text-amber" : "text-rose"} />
          <Stat icon={CheckCircle2} label="Categories" value={(i.dataCategories || []).length} />
        </div>
        <div>
          <p className="label mb-2 text-faint">Data Categories</p>
          <div className="flex flex-wrap gap-2">
            {(i.dataCategories || []).map((c) => (
              <span key={c} className="chip border border-border bg-panel text-muted">{c}</span>
            ))}
          </div>
        </div>
        {erroredState && (
          <div className="rounded-lg border border-rose/30 bg-rose/10 p-3 text-sm text-rose">
            Authentication token expired. Reconnect required to resume syncing.
          </div>
        )}
      </div>
    </Modal>
  );
}

function Stat({ icon: Icon, label, value, tint = "text-ink" }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <Icon size={15} className="mb-1.5 text-faint" />
      <p className="label mb-1 text-faint">{label}</p>
      <p className={`text-base font-semibold ${tint}`}>{value}</p>
    </div>
  );
}
