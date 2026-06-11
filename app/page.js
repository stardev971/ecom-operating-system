"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, DollarSign, Boxes, Megaphone, Sparkles, ArrowRight, Mail, Lock } from "lucide-react";

const FEATURES = [
  { icon: DollarSign, title: "Profit Intelligence", desc: "True profitability after COGS, ad spend, and fees — by product and channel." },
  { icon: Boxes, title: "Inventory Intelligence", desc: "Stockout and overstock risk forecasting across every SKU." },
  { icon: Megaphone, title: "Marketing Intelligence", desc: "Blended ROAS, CAC, and LTV across Meta, Google, TikTok, and email." },
  { icon: Sparkles, title: "AI Action Center", desc: "Insights converted into one-click, executable actions." },
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("ceo@ecomos.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const signIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/overview"), 550);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Marketing panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-panel p-12 lg:flex">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet/15 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet shadow-glow">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-ink">Ecom Operating System</p>
            <p className="text-xs text-faint">Executive operating layer for ecommerce</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
            Your Entire Ecommerce<br />Operation.<br />
            <span className="bg-gradient-to-r from-brand-soft to-violet bg-clip-text text-transparent">One Clear Picture.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Connect sales, advertising, inventory, support, fulfillment, and customer intelligence into one
            executive operating system.
          </p>

          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card/60 p-4">
                <f.icon size={18} className="text-brand-soft" />
                <p className="mt-2 text-sm font-semibold text-ink">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-faint">
          <span>12 integrations</span>
          <span>·</span>
          <span>15,000+ orders analyzed</span>
          <span>·</span>
          <span>AI-native</span>
        </div>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet">
              <Activity size={20} className="text-white" />
            </div>
            <p className="font-bold text-ink">Ecom Operating System</p>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Sign in to your executive dashboard.</p>

          <form onSubmit={signIn} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input !pl-9" type="email" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="input !pl-9" type="password" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" defaultChecked className="accent-brand" /> Remember me
              </label>
              <span className="cursor-pointer text-brand-soft hover:underline">Forgot password?</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? "Signing in…" : "Sign In to Dashboard"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-panel px-4 py-3 text-xs text-muted">
            <span className="font-medium text-ink">Demo credentials</span> are prefilled — just click Sign In.
            All data is simulated.
          </div>
        </div>
      </div>
    </div>
  );
}
