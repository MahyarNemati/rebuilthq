"use client";

import Link from "next/link";
import { useState } from "react";

const TIME_SLOTS = [
  { day: "Monday", times: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
  { day: "Tuesday", times: ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"] },
  { day: "Wednesday", times: ["10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"] },
  { day: "Thursday", times: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
  { day: "Friday", times: ["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"] },
];

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" });

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between bg-white">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>RebuiltHQ</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/20 mb-6">
            <span className="text-lg">🎁</span>
            <span className="text-sm font-medium text-[var(--accent)]" style={{ fontFamily: "var(--font-heading)" }}>100% Free — No Obligation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Book Your Free Consultation
          </h1>
          <p className="text-[var(--text-secondary)]">30 minutes. We&apos;ll analyze your business and show you what AI can do for you.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-[var(--accent)] text-white" : "bg-[var(--border)] text-[var(--text-muted)]"
              }`} style={{ fontFamily: "var(--font-mono)" }}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Pick a time */}
        {step === 1 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-bold text-lg mb-6" style={{ fontFamily: "var(--font-heading)" }}>Choose a day & time</h2>
            <div className="space-y-4">
              {TIME_SLOTS.map((slot) => (
                <div key={slot.day}>
                  <p className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>{slot.day}</p>
                  <div className="flex flex-wrap gap-2">
                    {slot.times.map((time) => {
                      const isSelected = selectedDay === slot.day && selectedTime === time;
                      return (
                        <button key={time}
                          onClick={() => { setSelectedDay(slot.day); setSelectedTime(time); }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-[var(--accent)] text-white"
                              : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30"
                          }`}
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedDay || !selectedTime}
              className="btn-primary w-full justify-center mt-8 disabled:opacity-40 !rounded-lg"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Step 2: Your details */}
        {step === 2 && (
          <form onSubmit={handleConfirm} className="glass-card rounded-2xl p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-mono)" }}>{selectedDay} at {selectedTime}</span>
              <button type="button" onClick={() => setStep(1)} className="text-xs text-[var(--accent)] underline ml-auto">Change</button>
            </div>
            <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Company / Website</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="Your business or URL" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Anything we should know?</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors resize-none" placeholder="Brief description of your business or what you're looking for..." />
            </div>
            <button type="submit" className="btn-primary w-full justify-center !rounded-lg">
              Confirm Booking
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </button>
          </form>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>You&apos;re booked!</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              <strong>{selectedDay} at {selectedTime}</strong> — We&apos;ll send a confirmation to <strong>{form.email}</strong> with a meeting link.
            </p>
            <div className="glass-card rounded-xl p-5 text-left mb-8 !bg-[var(--bg)]">
              <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>What to expect:</h3>
              <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                <p>1. We&apos;ll ask about your business, customers, and pain points</p>
                <p>2. We&apos;ll show you a live demo of a similar AI integration</p>
                <p>3. You&apos;ll get a clear recommendation — no pressure, no upsell</p>
              </div>
            </div>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-[var(--text-muted)] mt-8" style={{ fontFamily: "var(--font-mono)" }}>
          100% free &bull; 30 minutes &bull; No obligation &bull; Video or phone call
        </p>
      </div>
    </div>
  );
}
