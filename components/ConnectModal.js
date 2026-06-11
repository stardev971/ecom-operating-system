"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Info, Copy, Check, Lock, Loader2, CheckCircle2, Link2, ShieldCheck } from "lucide-react";
import Modal from "./Modal";
import { ProviderLogo } from "./ui";
import { AUTH_METHODS, authLabel, webhookFor } from "@/lib/integrations";
import { useApp } from "./Providers";

/* Connect / authorize flow for a single integration provider.
   Renders the correct credential fields for the provider's auth method,
   simulates the connection (form → connecting → connected), and persists
   the connected state through the app context. */
export default function ConnectModal({ provider, onClose }) {
  const { connectIntegration, toast } = useApp();
  const [phase, setPhase] = useState("form"); // form | connecting | connected
  const [values, setValues] = useState({});
  const [show, setShow] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPhase("form");
    setValues({});
    setShow({});
    setCopied(false);
  }, [provider]);

  if (!provider) return null;
  const method = AUTH_METHODS[provider.auth] || AUTH_METHODS.apikey;
  const isOauth = !!method.oauth;
  const webhook = webhookFor(provider.id);

  const canSubmit = isOauth || method.fields.every((f) => (values[f.key] || "").trim().length > 0);

  const submit = () => {
    setPhase("connecting");
    setTimeout(() => {
      setPhase("connected");
      connectIntegration(provider.id);
    }, 1500);
  };

  const finish = () => {
    toast(`${provider.name} connected`, { detail: "Initial sync started", type: "success" });
    onClose();
  };

  const copyWebhook = () => {
    navigator.clipboard?.writeText(webhook).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Modal
      open={!!provider}
      onClose={onClose}
      title={phase === "connected" ? `${provider.name} connected` : `Connect ${provider.name}`}
      subtitle={phase === "connected" ? "Authorization complete" : `Authentication via ${authLabel(provider.auth)}`}
      iconNode={<ProviderLogo name={provider.name} color={provider.color} size={36} rounded="rounded-lg" />}
      footer={
        phase === "connected" ? (
          <button onClick={finish} className="btn-primary">Done</button>
        ) : phase === "connecting" ? (
          <button disabled className="btn-primary opacity-70"><Loader2 size={15} className="animate-spin" /> Connecting…</button>
        ) : (
          <>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={submit} disabled={!canSubmit} className={`btn-primary ${!canSubmit ? "opacity-50" : ""}`}>
              {isOauth ? <Link2 size={15} /> : <Lock size={15} />} Connect Integration
            </button>
          </>
        )
      }
    >
      {phase === "connected" ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <CheckCircle2 size={40} className="text-emerald" />
            <p className="text-sm font-medium text-ink">{provider.name} is now connected</p>
            <p className="text-xs text-muted">Credentials verified · initial sync queued · webhook registered.</p>
          </div>
          <div>
            <p className="label mb-2 text-faint">Data now syncing</p>
            <div className="flex flex-wrap gap-2">
              {(provider.dataCategories || []).map((c) => (
                <span key={c} className="chip border border-emerald/30 bg-emerald/10 text-emerald">{c}</span>
              ))}
            </div>
          </div>
        </div>
      ) : phase === "connecting" ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Loader2 size={34} className="animate-spin text-brand-soft" />
          <p className="text-sm font-medium text-ink">{isOauth ? `Authorizing with ${provider.name}…` : `Verifying credentials with ${provider.name}…`}</p>
          <p className="text-xs text-muted">Establishing a secure connection and registering the webhook.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">{provider.desc}</p>

          {isOauth ? (
            <button
              onClick={submit}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: provider.color === "#ffe01b" || provider.color === "#fffc00" ? "#111827" : provider.color }}
            >
              <Link2 size={16} /> Continue with {provider.name}
            </button>
          ) : (
            <div className="space-y-3.5">
              {method.fields.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <div className="relative mt-1.5">
                    <input
                      type={f.type === "password" && !show[f.key] ? "password" : "text"}
                      value={values[f.key] || ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="input pr-10"
                    />
                    {f.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShow((s) => ({ ...s, [f.key]: !s[f.key] }))}
                        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-faint hover:text-ink"
                      >
                        {show[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {provider.hint && (
            <div className="flex gap-2.5 rounded-lg border border-sky/25 bg-sky/10 p-3">
              <Info size={15} className="mt-0.5 shrink-0 text-sky" />
              <p className="text-xs leading-relaxed text-muted">
                <span className="font-semibold text-ink">Where to find this:</span> {provider.hint}
              </p>
            </div>
          )}

          <div>
            <label className="label">Webhook Endpoint (for real-time sync)</label>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-panel px-3 py-2 font-mono text-xs text-muted">{webhook}</code>
              <button onClick={copyWebhook} className="btn-ghost !px-2.5 !py-2">
                {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-faint">Add this URL in your {provider.name} webhook settings for real-time event delivery.</p>
          </div>

          <div className="flex items-center gap-2 border-t border-border pt-3 text-[11px] text-faint">
            <ShieldCheck size={13} className="text-emerald" />
            Credentials are encrypted at rest with AES-256 and never stored in plain text.
          </div>
        </div>
      )}
    </Modal>
  );
}
