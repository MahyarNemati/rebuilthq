"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

type TimeSlot = { time: string; available: boolean };
type DaySlots = { date: string; dayOfWeek: number; dayName: string; slots: TimeSlot[] };

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [icsContent, setIcsContent] = useState("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/slots?days=14");
      const data = await res.json();
      if (data.success) setDays(data.slots);
    } catch {
      setError("Failed to load availability. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          notes: form.notes || undefined,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingId(data.bookingId);
        setIcsContent(data.icsContent);
        setStep(3);
      } else {
        setError(data.error || "Booking failed. Please try again.");
        if (res.status === 409) {
          // Slot taken — reload availability
          await loadSlots();
          setStep(1);
          setSelectedDate("");
          setSelectedTime("");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadICS() {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rebuilthq-consultation.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const selectedDayData = days.find((d) => d.date === selectedDate);

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
          <p className="text-[var(--text-secondary)]">30 minutes. We&apos;ll analyze your business and show you what AI can do.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[
            { n: 1, label: "Pick Time" },
            { n: 2, label: "Details" },
            { n: 3, label: "Confirmed" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.n ? "bg-[var(--accent)] text-white" : "bg-[var(--border)] text-[var(--text-muted)]"
                }`} style={{ fontFamily: "var(--font-mono)" }}>{s.n}</div>
                <span className="text-[10px] text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</span>
              </div>
              {s.n < 3 && <div className={`w-12 h-0.5 rounded mb-4 ${step > s.n ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {/* Step 1: Pick a time */}
        {step === 1 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-bold text-lg mb-6" style={{ fontFamily: "var(--font-heading)" }}>Choose a day & time</h2>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-[var(--text-muted)]">Loading availability...</p>
              </div>
            ) : days.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[var(--text-secondary)] mb-2">No availability found.</p>
                <p className="text-sm text-[var(--text-muted)]">Please contact us at hello@rebuilthq.com</p>
              </div>
            ) : (
              <>
                {/* Day selector */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-2 px-2">
                  {days.map((day) => {
                    const isSelected = selectedDate === day.date;
                    const availCount = day.slots.filter((s) => s.available).length;
                    return (
                      <button
                        key={day.date}
                        onClick={() => { setSelectedDate(day.date); setSelectedTime(""); }}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? "bg-[var(--charcoal)] text-white"
                            : "bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                        }`}
                        style={{ minWidth: 90 }}
                      >
                        <div className="text-xs font-medium mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{day.dayName.slice(0, 3)}</div>
                        <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                          {new Date(day.date + "T12:00:00").getDate()}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? "text-white/60" : "text-[var(--text-muted)]"}`} style={{ fontFamily: "var(--font-mono)" }}>
                          {availCount} slot{availCount !== 1 ? "s" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Time slots for selected day */}
                {selectedDayData && (
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                      {selectedDayData.dayName}, {formatDate(selectedDate)} — Eastern Time
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {selectedDayData.slots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-[var(--accent)] text-white"
                                : slot.available
                                  ? "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30 hover:text-[var(--text)]"
                                  : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]/40 line-through cursor-not-allowed opacity-40"
                            }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {formatTime(slot.time)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!selectedDate && (
                  <p className="text-center text-sm text-[var(--text-muted)] py-8">Select a day above to see available times.</p>
                )}
              </>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!selectedDate || !selectedTime}
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent)]/10 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                {selectedDayData?.dayName}, {formatDate(selectedDate)} at {formatTime(selectedTime)} ET
              </span>
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
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors resize-none" placeholder="What does your business do? What are you hoping AI can help with?" />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-shrink-0">Back</button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center !rounded-lg disabled:opacity-60">
                {submitting ? "Booking..." : "Confirm Booking"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>You&apos;re booked!</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              <strong>{selectedDayData?.dayName}, {formatDate(selectedDate)}</strong> at <strong>{formatTime(selectedTime)} ET</strong>
              <br />
              Confirmation sent to <strong>{form.email}</strong>
            </p>

            {/* Add to calendar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <button onClick={downloadICS} className="btn-primary !rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Add to Calendar (.ics)
              </button>
              <Link href="/" className="btn-secondary !rounded-lg">Back to Home</Link>
            </div>

            <div className="glass-card rounded-xl p-5 text-left !bg-[var(--bg)]">
              <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>What to expect:</h3>
              <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                <div className="flex gap-2"><span className="text-[var(--accent)]">1.</span> We&apos;ll ask about your business, customers, and pain points</div>
                <div className="flex gap-2"><span className="text-[var(--accent)]">2.</span> We&apos;ll show you a live demo of a similar AI integration</div>
                <div className="flex gap-2"><span className="text-[var(--accent)]">3.</span> You&apos;ll get a clear recommendation — no pressure, no upsell</div>
              </div>
            </div>

            {bookingId && (
              <p className="text-[10px] text-[var(--text-muted)] mt-6" style={{ fontFamily: "var(--font-mono)" }}>
                Booking ID: {bookingId}
              </p>
            )}
          </div>
        )}

        <p className="text-center text-xs text-[var(--text-muted)] mt-8" style={{ fontFamily: "var(--font-mono)" }}>
          100% free &bull; 30 minutes &bull; No obligation &bull; Video or phone call
        </p>
      </div>
    </div>
  );
}
