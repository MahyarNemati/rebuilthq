"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "conversations" | "leads" | "documents";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between bg-white">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--charcoal)] flex items-center justify-center text-white text-xs font-bold" style={{ fontFamily: "var(--font-mono)" }}>R</div>
            <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Admin</span>
          </Link>
          <div className="flex gap-1">
            {(["overview", "conversations", "leads", "documents"] as Tab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${activeTab === tab ? "bg-[var(--charcoal)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-warm)]"}`}
                style={{ fontFamily: "var(--font-heading)" }}>{tab}</button>
            ))}
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <>
            <h1 className="text-2xl font-bold mb-8 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Conversations", value: "—", sub: "Connect DB", color: "var(--accent)" },
                { label: "Active Now", value: "—", sub: "Real-time", color: "var(--success)" },
                { label: "Leads", value: "—", sub: "This month", color: "var(--blue)" },
                { label: "Escalations", value: "—", sub: "Needs attention", color: "#E64A19" },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-xl p-5">
                  <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</p>
                  <p className="text-3xl font-bold mb-1" style={{ color: s.color, fontFamily: "var(--font-mono)" }}>{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{s.sub}</p>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-semibold mb-4 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Tenants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "NTRL Diffuser Co", slug: "ntrl", type: "Shopify Support", color: "#2E7D32" },
                { name: "Ramez Ghaly Law", slug: "ramezghalylaw", type: "Document Processing", color: "#1565C0" },
                { name: "RebuiltHQ", slug: "rebuilthq", type: "Sales + Content", color: "#FF5722" },
              ].map((t) => (
                <div key={t.slug} className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{t.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>{t.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="status-pill !text-[11px] !py-1 !px-2.5"><span className="dot" />Active</span>
                    <Link href={`/demo/${t.slug}`} className="text-xs text-[var(--accent)] hover:underline" style={{ fontFamily: "var(--font-mono)" }}>Demo →</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab !== "overview" && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg mb-2 capitalize">{activeTab}</p>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>Connect a database to populate this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
