"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "conversations" | "leads" | "documents";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Admin Nav */}
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--accent)] flex items-center justify-center text-xs font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              R
            </div>
            <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Admin
            </span>
          </Link>
          <div className="flex gap-1">
            {(["overview", "conversations", "leads", "documents"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <>
            <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Total Conversations", value: "—", change: "Connect DB", color: "var(--accent)" },
                { label: "Active Now", value: "—", change: "Real-time", color: "var(--success)" },
                { label: "Leads Captured", value: "—", change: "This month", color: "var(--warning)" },
                { label: "Escalations", value: "—", change: "Needs attention", color: "var(--danger)" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-5">
                  <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mb-1" style={{ color: stat.color, fontFamily: "var(--font-mono)" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Tenants */}
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Tenants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "NTRL Diffuser Co", slug: "ntrl", type: "Shopify Support", color: "#22c55e", status: "Active" },
                { name: "Ramez Ghaly Law", slug: "ramezghalylaw", type: "Document Processing", color: "#3b82f6", status: "Active" },
                { name: "RebuiltHQ", slug: "rebuilthq", type: "Sales + Content", color: "#8b5cf6", status: "Active" },
              ].map((tenant) => (
                <div key={tenant.slug} className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tenant.color }} />
                    <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                      {tenant.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                    {tenant.type}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400" style={{ fontFamily: "var(--font-mono)" }}>
                      {tenant.status}
                    </span>
                    <Link
                      href={`/demo/${tenant.slug}`}
                      className="text-xs text-[var(--accent)] hover:underline"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      View Demo →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "conversations" && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg mb-2">Conversations</p>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
              Connect a database to view conversation history across all tenants.
            </p>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg mb-2">Leads Pipeline</p>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
              Leads captured by the RebuiltHQ sales chatbot will appear here.
            </p>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg mb-2">Document Library</p>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
              Documents uploaded to Ramez Ghaly Law will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
