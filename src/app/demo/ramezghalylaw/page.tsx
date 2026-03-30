"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";

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
      const res = await fetch(`${API_HOST}/api/docs/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setUploadStatus(data.success ? `✓ "${file.name}" uploaded and processed.` : `✕ Upload failed: ${data.error}`);
    } catch {
      setUploadStatus("✕ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1565C0]" />
              <span className="section-label !text-[#1565C0]">AI Document Processing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Ramez Ghaly Law</h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              An AI document assistant for a multi-practice law firm. Upload legal documents and ask questions — get instant analysis, summaries, and clause extraction.
            </p>
            <div className="glass-card rounded-xl p-6 mb-8">
              <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Upload a Document</h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-8 cursor-pointer hover:border-[#1565C0]/30 transition-colors bg-white">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="1.5" className="mb-3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                <span className="text-sm text-[var(--text-secondary)] mb-1">{isUploading ? "Uploading..." : "Drop a PDF, DOCX, or TXT file"}</span>
                <span className="text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>Max 10MB</span>
                <input type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} disabled={isUploading} className="hidden" />
              </label>
              {uploadStatus && <p className={`text-sm mt-3 ${uploadStatus.startsWith("✓") ? "text-[#2E7D32]" : "text-red-500"}`}>{uploadStatus}</p>}
            </div>
            <div className="space-y-3 mb-8">
              {["Contract analysis — identifies key terms, dates, obligations", "Document summarization — condensed overviews", "Clause extraction — pulls specific sections", "Plain language — explains legal jargon simply", "Multi-document — questions across all uploaded files"].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="text-[#1565C0] mt-0.5 text-sm">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <ChatWidget tenantSlug="ramezghalylaw" primaryColor="#1565C0" greeting="Welcome to Ramez Ghaly Law's document assistant. Upload a legal document on the left, then ask me anything about it." title="Legal Document AI" embedded />
          </div>
        </div>
      </div>
    </div>
  );
}
