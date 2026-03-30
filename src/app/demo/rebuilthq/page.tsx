"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";

type ContentResult = { type: string; results: string[] };

export default function RebuiltHQDemo() {
  const [contentType, setContentType] = useState("ad_copy");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [results, setResults] = useState<ContentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (!product.trim() || !audience.trim()) return;
    setIsGenerating(true);
    setResults(null);
    try {
      const res = await fetch(`${API_HOST}/api/content/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: contentType, product, audience }),
      });
      const data = await res.json();
      if (data.success) setResults(data);
    } catch { /* handled */ } finally { setIsGenerating(false); }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between bg-white">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>RebuiltHQ</span>
        </Link>
        <div className="status-pill"><span className="dot" />Live Demo</div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="section-label">AI Sales + Content Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>RebuiltHQ</h1>
        <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-12 max-w-2xl">
          Our own site runs on what we sell. Two demos: a sales chatbot that qualifies leads, and a content engine that generates marketing copy on demand.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Content Engine</h2>
            <div className="glass-card rounded-xl p-6 space-y-5">
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: "ad_copy", label: "Ad Copy" }, { value: "seo", label: "SEO Content" }, { value: "social", label: "Social Posts" }, { value: "email", label: "Email Copy" }].map((type) => (
                    <button key={type.value} onClick={() => setContentType(type.value)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${contentType === type.value ? "bg-[var(--charcoal)] text-white" : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"}`}
                      style={{ fontFamily: "var(--font-heading)" }}>{type.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>Product / Service</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., Zero-nicotine botanical diffuser, $28.99"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--border-hover)]" />
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>Target Audience</label>
                <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Health-conscious millennials, 25-35"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--border-hover)]" />
              </div>
              <button onClick={handleGenerate} disabled={!product.trim() || !audience.trim() || isGenerating}
                className="btn-primary w-full !rounded-lg justify-center disabled:opacity-40">
                {isGenerating ? "Generating..." : "Generate Content"}
              </button>
            </div>
            {results && (
              <div className="mt-6 space-y-3">
                <h3 className="section-label">Generated ({results.results.length} variations)</h3>
                {results.results.map((result, i) => (
                  <div key={i} className="glass-card rounded-xl p-5 group relative">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{result}</p>
                    <button onClick={() => navigator.clipboard.writeText(result)}
                      className="absolute top-3 right-3 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}>Copy</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Sales Chatbot</h2>
            <ChatWidget tenantSlug="rebuilthq" primaryColor="#FF5722" greeting="Hey! 👋 I'm the RebuiltHQ sales assistant. Thinking about adding AI to your business? Tell me about what you do and I'll show you what's possible." title="RebuiltHQ Sales" embedded />
          </div>
        </div>
      </div>
    </div>
  );
}
