"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

type ContentResult = {
  type: string;
  results: string[];
};

export default function RebuiltHQDemo() {
  const [contentType, setContentType] = useState<string>("ad_copy");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [results, setResults] = useState<ContentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (!product.trim() || !audience.trim()) return;

    setIsGenerating(true);
    setResults(null);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: contentType, product, audience }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data);
      }
    } catch {
      // Handle error silently
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <span>←</span>
          <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>Back to RebuiltHQ</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" style={{ boxShadow: "0 0 12px #8b5cf640" }} />
          <span className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>Live Demo</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
            AI Sales + Content Engine
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          RebuiltHQ
        </h1>

        <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-12 max-w-2xl">
          Our own site runs on what we sell. Two demos below: a sales chatbot that qualifies
          leads, and a content engine that generates marketing copy on demand.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Content Engine */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Content Engine
            </h2>

            <div className="glass-card rounded-xl p-6 space-y-5">
              {/* Content type selector */}
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "ad_copy", label: "Ad Copy" },
                    { value: "seo", label: "SEO Content" },
                    { value: "social", label: "Social Posts" },
                    { value: "email", label: "Email Copy" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setContentType(type.value)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        contentType === type.value
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[#111] border border-[#222] text-[var(--text-secondary)] hover:border-[#333]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>
                  Product / Service
                </label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g., Zero-nicotine botanical diffuser, $28.99"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#333] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Health-conscious millennials, 25-35"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#333] transition-colors"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!product.trim() || !audience.trim() || isGenerating}
                className="btn-glow w-full !py-3 text-sm disabled:opacity-40"
              >
                {isGenerating ? "Generating..." : "Generate Content"}
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm tracking-wider uppercase text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                  Generated ({results.results.length} variations)
                </h3>
                {results.results.map((result, i) => (
                  <div key={i} className="glass-card rounded-xl p-5 group relative">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {result}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="absolute top-3 right-3 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Sales Chatbot */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Sales Chatbot
            </h2>
            <ChatWidget
              tenantSlug="rebuilthq"
              primaryColor="#8b5cf6"
              greeting="Hey! 👋 I'm the RebuiltHQ sales assistant. Thinking about adding AI to your business? Tell me about what you do and I'll show you what's possible."
              title="RebuiltHQ Sales"
              embedded
            />
          </div>
        </div>
      </div>
    </div>
  );
}
