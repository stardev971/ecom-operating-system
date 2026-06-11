/* Global search across products, customers, campaigns, recommendations. */
export function searchAll(data, query, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out = [];

  for (const p of data.products) {
    if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
      out.push({ type: "product", id: p.id, label: p.name, sub: p.sku, href: `/revenue?product=${p.id}` });
    }
  }
  for (const c of data.customers) {
    if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
      out.push({ type: "customer", id: c.id, label: c.name, sub: c.email, href: `/customers?customer=${c.id}` });
    }
  }
  for (const c of data.campaigns) {
    if (c.name.toLowerCase().includes(q)) {
      out.push({ type: "campaign", id: c.id, label: c.name, sub: `${c.roas}x ROAS`, href: `/marketing?campaign=${c.id}` });
    }
  }
  for (const r of data.recommendations) {
    if (r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)) {
      out.push({ type: "recommendation", id: r.id, label: r.title, sub: r.module, href: `/ai-center` });
    }
  }

  // crude relevance: exact prefix first
  out.sort((a, b) => {
    const ap = a.label.toLowerCase().startsWith(q) ? 0 : 1;
    const bp = b.label.toLowerCase().startsWith(q) ? 0 : 1;
    return ap - bp;
  });
  return out.slice(0, limit);
}
