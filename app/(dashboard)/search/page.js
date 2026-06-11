"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, User, Megaphone, Sparkles, Search as SearchIcon } from "lucide-react";
import { useApp } from "@/components/Providers";
import { PageHeader, SectionCard, EmptyState } from "@/components/ui";
import { searchAll } from "@/lib/search";

const ICON = { product: Package, customer: User, campaign: Megaphone, recommendation: Sparkles };
const GROUPS = [
  { type: "product", label: "Products" },
  { type: "customer", label: "Customers" },
  { type: "campaign", label: "Campaigns" },
  { type: "recommendation", label: "Recommendations" },
];

function Results() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const { data } = useApp();
  const results = searchAll(data, q, 200);

  return (
    <div>
      <PageHeader title="Search Results" subtitle={`${results.length} results for “${q}”`} />
      {results.length === 0 ? (
        <div className="card">
          <EmptyState icon={SearchIcon} title="No results found" sub={`Nothing matched “${q}”. Try a product, customer, or campaign name.`} />
        </div>
      ) : (
        <div className="space-y-4">
          {GROUPS.map((g) => {
            const items = results.filter((r) => r.type === g.type);
            if (items.length === 0) return null;
            const Icon = ICON[g.type];
            return (
              <SectionCard key={g.type} title={`${g.label} (${items.length})`} pad={false}>
                <div className="divide-y divide-border/60">
                  {items.slice(0, 20).map((r) => (
                    <Link key={r.id} href={r.href} className="flex items-center gap-3 px-5 py-3 hover:bg-cardhover">
                      <Icon size={16} className="text-faint" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{r.label}</p>
                        {r.sub && <p className="text-[11px] text-faint">{r.sub}</p>}
                      </div>
                      <span className="text-[11px] uppercase tracking-wide text-faint">{r.type}</span>
                    </Link>
                  ))}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Searching…</p>}>
      <Results />
    </Suspense>
  );
}
