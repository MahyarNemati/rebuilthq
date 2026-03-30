"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export default function RamezGhalyLawDemo() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantSlug", "ramezghalylaw");

      const res = await fetch("/api/docs/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadStatus(`✓ "${file.name}" uploaded and processed. You can now ask questions about it.`);
      } else {
        setUploadStatus(`✕ Upload failed: ${data.error}`);
      }
    } catch {
      setUploadStatus("✕ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
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
          <div className="w-3 h-3 rounded-full bg-blue-500" style={{ boxShadow: "0 0 12px #3b82f640" }} />
          <span className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>Live Demo</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info + Upload */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                AI Document Processing
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Ramez Ghaly Law
            </h1>

            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              An AI document assistant for a multi-practice law firm. Upload legal documents
              and ask questions — get instant analysis, summaries, and clause extraction.
            </p>

            {/* Upload area */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Upload a Document
              </h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-8 cursor-pointer hover:border-blue-500/30 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="mb-3">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-sm text-[var(--text-secondary)] mb-1">
                  {isUploading ? "Uploading..." : "Drop a PDF, DOCX, or TXT file"}
                </span>
                <span className="text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                  Max 10MB
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              {uploadStatus && (
                <p className={`text-sm mt-3 ${uploadStatus.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
                  {uploadStatus}
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-sm tracking-[0.2em] uppercase text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                Capabilities
              </h3>
              {[
                "Contract analysis — identifies key terms, dates, and obligations",
                "Document summarization — condensed overviews of lengthy documents",
                "Clause extraction — pulls specific sections on demand",
                "Plain language — explains legal jargon in simple terms",
                "Multi-document — ask questions across all uploaded files",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Try asking (after uploading):
              </h3>
              <div className="space-y-2 text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                <p>&quot;Summarize this document&quot;</p>
                <p>&quot;What are the key obligations?&quot;</p>
                <p>&quot;When does this agreement expire?&quot;</p>
                <p>&quot;Are there any unusual clauses?&quot;</p>
              </div>
            </div>
          </div>

          {/* Right — Chat */}
          <div className="lg:sticky lg:top-24">
            <ChatWidget
              tenantSlug="ramezghalylaw"
              primaryColor="#3b82f6"
              greeting="Welcome to Ramez Ghaly Law's document assistant. Upload a legal document on the left, then ask me anything about it. I can summarize, extract clauses, and explain legal terms in plain language."
              title="Legal Document AI"
              embedded
            />
          </div>
        </div>
      </div>
    </div>
  );
}
