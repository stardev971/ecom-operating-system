"use client";

import { useState } from "react";
import { Building2, Users, Bell, Sparkles, Cable, Palette, ScrollText, Check } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useTheme } from "@/components/ThemeProvider";
import { PageHeader, SectionCard, Avatar, StatusBadge } from "@/components/ui";
import { Sun, Moon } from "lucide-react";

const TABS = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
  { id: "integrations", label: "Integrations", icon: Cable },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
];

const TEAM = [
  { name: "CEO User", email: "ceo@ecomos.com", role: "Owner" },
  { name: "Dana Reyes", email: "dana@ecomos.com", role: "Admin" },
  { name: "Marcus Lin", email: "marcus@ecomos.com", role: "Marketing" },
  { name: "Priya Nair", email: "priya@ecomos.com", role: "Operations" },
  { name: "Sam Okafor", email: "sam@ecomos.com", role: "Analyst" },
];

const AUDIT = [
  { who: "CEO User", action: "Approved recommendation: Scale Spring Collection", time: "12 min ago" },
  { who: "Marcus Lin", action: "Paused campaign: Competitor Conquest — Google", time: "1h ago" },
  { who: "System", action: "Synced 4,210 records from Shopify", time: "2h ago" },
  { who: "Priya Nair", action: "Created purchase order: Wireless Earbuds Pro", time: "4h ago" },
  { who: "Dana Reyes", action: "Exported Profitability Report (PDF)", time: "Yesterday" },
  { who: "System", action: "TikTok Ads sync failed — token expired", time: "Yesterday" },
];

export default function Settings() {
  const { toast } = useApp();
  const [tab, setTab] = useState("org");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your organization, team, and platform preferences." />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="card p-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${tab === t.id ? "bg-brand/15 text-ink" : "text-muted hover:bg-cardhover hover:text-ink"}`}>
                <t.icon size={16} className={tab === t.id ? "text-brand-soft" : "text-faint"} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {tab === "org" && <OrgSettings toast={toast} />}
          {tab === "users" && <UserSettings toast={toast} />}
          {tab === "notifications" && <NotificationSettings toast={toast} />}
          {tab === "ai" && <AISettings toast={toast} />}
          {tab === "integrations" && <IntegrationSettings />}
          {tab === "theme" && <ThemeSettings toast={toast} />}
          {tab === "audit" && <AuditSettings />}
        </div>
      </div>
    </div>
  );
}

function SaveBar({ toast, label = "Changes saved" }) {
  return (
    <div className="mt-5 flex justify-end border-t border-border pt-4">
      <button onClick={() => toast(label, { type: "success" })} className="btn-primary"><Check size={15} /> Save changes</button>
    </div>
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

function OrgSettings({ toast }) {
  return (
    <SectionCard title="Organization">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company Name"><input defaultValue="Northwind Commerce Co." className="input" /></Field>
        <Field label="Website"><input defaultValue="https://northwind.example.com" className="input" /></Field>
        <Field label="Currency"><select className="input"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select></Field>
        <Field label="Timezone"><select className="input"><option>America/New_York</option><option>America/Los_Angeles</option><option>Europe/London</option></select></Field>
        <Field label="Fiscal Year Start"><select className="input"><option>January</option><option>April</option><option>July</option></select></Field>
        <Field label="Industry"><select className="input"><option>Consumer Electronics</option><option>Apparel</option><option>Beauty</option><option>Home & Lifestyle</option></select></Field>
      </div>
      <SaveBar toast={toast} />
    </SectionCard>
  );
}

function UserSettings({ toast }) {
  return (
    <SectionCard title="Users & Roles" action={<button onClick={() => toast("Invite sent", { type: "success" })} className="btn-soft !py-1.5 !text-xs">Invite user</button>} pad={false}>
      <div className="divide-y divide-border/60">
        {TEAM.map((u) => (
          <div key={u.email} className="flex items-center gap-3 px-5 py-3">
            <Avatar name={u.name} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{u.name}</p>
              <p className="text-[11px] text-faint">{u.email}</p>
            </div>
            <select defaultValue={u.role} className="input !w-auto !py-1.5 text-xs">
              <option>Owner</option><option>Admin</option><option>Marketing</option><option>Operations</option><option>Analyst</option>
            </select>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ToggleRow({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand" : "bg-border"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function NotificationSettings({ toast }) {
  return (
    <SectionCard title="Notifications">
      <div className="divide-y divide-border/60">
        <ToggleRow label="Critical inventory alerts" desc="Stockout risk within lead time" defaultOn />
        <ToggleRow label="Campaign performance alerts" desc="ROAS drops below threshold" defaultOn />
        <ToggleRow label="Support escalations" desc="Urgent tickets and SLA breaches" defaultOn />
        <ToggleRow label="AI recommendation digest" desc="Daily summary of new recommendations" defaultOn />
        <ToggleRow label="Weekly executive summary" desc="Emailed every Monday morning" />
      </div>
      <SaveBar toast={toast} label="Notification preferences saved" />
    </SectionCard>
  );
}

function AISettings({ toast }) {
  return (
    <SectionCard title="AI Preferences">
      <div className="space-y-4">
        <Field label="Automation level">
          <select className="input"><option>Suggest only — require approval</option><option>Auto-approve low-risk actions</option><option>Full autopilot</option></select>
        </Field>
        <Field label="Recommendation aggressiveness">
          <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-brand" />
        </Field>
        <div className="divide-y divide-border/60">
          <ToggleRow label="Inventory recommendations" desc="Reorder and clearance suggestions" defaultOn />
          <ToggleRow label="Marketing recommendations" desc="Scale, pause, and budget actions" defaultOn />
          <ToggleRow label="Customer recommendations" desc="Retention and win-back triggers" defaultOn />
        </div>
      </div>
      <SaveBar toast={toast} label="AI preferences saved" />
    </SectionCard>
  );
}

function IntegrationSettings() {
  const { connectedIntegrations } = useApp();
  return (
    <SectionCard title={`Integrations (${connectedIntegrations.length} connected)`} action={<Link href="/integrations" className="text-xs font-medium text-brand-soft hover:underline">Manage all →</Link>} pad={false}>
      <div className="divide-y divide-border/60">
        {connectedIntegrations.map((i) => (
          <div key={i.id} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm font-medium text-ink">{i.name}</span>
            <StatusBadge status={i.status} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ThemeSettings({ toast }) {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const OPTIONS = [
    { id: "light", label: "Light", icon: Sun, hint: "Default — bright and clean" },
    { id: "dark", label: "Dark", icon: Moon, hint: "Dimmed for low-light" },
  ];
  return (
    <SectionCard title="Theme">
      <Field label="Appearance">
        <div className="grid grid-cols-2 gap-3">
          {OPTIONS.map((o) => {
            const selected = theme === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setTheme(o.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${selected ? "border-brand ring-1 ring-brand/40" : "border-border hover:border-borderlight"}`}
              >
                <div className={`mb-3 flex h-16 items-center justify-center rounded-lg border ${o.id === "dark" ? "border-[#222c40] bg-[#0a0e17]" : "border-[#e2e6ec] bg-[#f6f7fa]"}`}>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    <span className={`h-2 w-8 rounded-full ${o.id === "dark" ? "bg-[#222c40]" : "bg-[#d2d8e0]"}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <o.icon size={15} className={selected ? "text-brand-soft" : "text-faint"} /> {o.label}
                  </span>
                  {selected && <Check size={15} className="text-brand-soft" />}
                </div>
                <p className="mt-1 text-xs text-muted">{o.hint}</p>
              </button>
            );
          })}
        </div>
      </Field>
      <div className="mt-5">
        <label className="label">Accent color</label>
        <div className="mt-2 flex gap-2">
          {["#6366f1", "#0ea5e9", "#10b981", "#f43f5e", "#8b5cf6", "#f59e0b"].map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all ${(accent || "#6366f1") === c ? "ring-ink" : "ring-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-faint">Changes apply instantly and are saved to this browser.</p>
      </div>
      <div className="mt-5 flex justify-end border-t border-border pt-4">
        <button onClick={() => toast("Theme preferences saved", { type: "success" })} className="btn-primary"><Check size={15} /> Save changes</button>
      </div>
    </SectionCard>
  );
}

function AuditSettings() {
  return (
    <SectionCard title="Audit Logs" pad={false}>
      <div className="divide-y divide-border/60">
        {AUDIT.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-soft" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{a.action}</p>
              <p className="text-[11px] text-faint">{a.who} · {a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
