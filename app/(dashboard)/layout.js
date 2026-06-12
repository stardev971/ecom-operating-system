"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { AppProvider } from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { isAuthed } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Auth gate: unauthenticated visitors (including anyone opening a shared deep
  // link) are sent to the login screen, then returned to the page they wanted.
  useEffect(() => {
    if (isAuthed()) {
      setReady(true);
    } else {
      router.replace(`/?next=${encodeURIComponent(pathname || "/overview")}`);
    }
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet shadow-glow">
            <Activity size={22} className="text-white" />
          </div>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
          </div>
          <p className="text-xs text-faint">Verifying your session…</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="md:pl-64">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="grid-bg mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </AppProvider>
  );
}
