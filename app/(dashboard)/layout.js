"use client";

import { useState } from "react";
import { AppProvider } from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
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
