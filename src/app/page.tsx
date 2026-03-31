"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CASE_STUDIES = [
  {
    slug: "ntrl",
    name: "NTRL Diffuser Co",
    type: "AI Customer Support",
    description: "Claude-powered support agent handling product questions, order tracking, and seamless human escalation for a botanical diffuser brand.",
    tags: ["Shopify", "Chat Widget", "Order Tracking", "Escalation"],
    metric: "24/7 automated support",
    color: "#2E7D32",
  },
  {
    slug: "ramezghalylaw",
    name: "Ramez Ghaly Law",
    type: "AI Document Processing",
    description: "Intelligent document assistant analyzing legal contracts, extracting key clauses, and answering questions in plain language.",
    tags: ["PDF Analysis", "RAG", "Summarization", "Legal"],
    metric: "90% faster document review",
    color: "#1565C0",
  },
  {
    slug: "rebuilthq",
    name: "RebuiltHQ",
    type: "AI Sales + Content Engine",
    description: "Our own site runs what we sell — sales chatbot qualifying leads and a content engine generating ad copy, SEO, and social posts.",
    tags: ["Lead Qualification", "Content Generation", "Sales Bot"],
    metric: "Self-hosted proof of concept",
    color: "#FF5722",
  },
];

const SERVICES = [
  { icon: "01", title: "AI Customer Support", description: "Claude-powered chat agents that know your products, track orders, and escalate to humans when needed. Embeddable on any website with a single line of code." },
  { icon: "02", title: "AI Document Processing", description: "Upload contracts, invoices, or reports. AI extracts data, summarizes key points, and answers questions instantly. Works with PDF, DOCX, and more." },
  { icon: "03", title: "AI Sales & Lead Qualification", description: "Intelligent chatbots that engage website visitors, qualify leads, capture contact info, and notify your team via Slack or email — 24/7." },
  { icon: "04", title: "AI Content Generation", description: "Ad copy, SEO content, social posts, and email campaigns — all generated from your brand voice and product data. Dozens of variations in seconds." },
  { icon: "05", title: "AI Internal Operations", description: "Connect AI to your internal docs, SOPs, and knowledge base. Employees get instant answers instead of searching through files and Slack threads." },
  { icon: "06", title: "Custom AI Integrations", description: "Need something unique? We build bespoke Claude API integrations tailored to your exact business workflow — from data pipelines to decision engines." },
];

const FAQS = [
  { q: "What exactly does RebuiltHQ do?", a: "We integrate AI (specifically Anthropic's Claude) into your existing business operations. Whether that's a customer support chatbot on your website, an AI assistant that processes legal documents, or a sales bot that qualifies leads — we build, deploy, and maintain the entire system." },
  { q: "How is this different from ChatGPT or other AI tools?", a: "Those are general-purpose tools. We build custom AI solutions trained on YOUR data — your products, your policies, your brand voice. The AI knows your business inside out and integrates directly into your website or workflow." },
  { q: "How long does implementation take?", a: "Most integrations go live in under 2 weeks. Simple chat widgets can be deployed in days. Complex document processing or multi-system integrations may take 3-4 weeks." },
  { q: "Is my data safe?", a: "Absolutely. We use Anthropic's enterprise-grade Claude API with strict data handling policies. Your data is never used to train AI models. All communications are encrypted, and we implement rate limiting and authentication on every endpoint." },
  { q: "What happens if the AI can't answer a question?", a: "Every system we build includes intelligent escalation. When the AI detects it can't help, it seamlessly hands off to a human team member via Slack, email, or your preferred channel — with a full summary of the conversation." },
  { q: "Can I try it before committing?", a: "Yes! Your first consultation is completely free. We'll analyze your business, recommend the right AI integration, and show you a live demo of what it would look like. No obligation." },
];

const LOGOS = ["Anthropic", "Claude API", "Shopify", "Next.js", "PostgreSQL", "TypeScript", "Vercel", "Supabase"];

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // In production, wire this to /api/leads or an email service
    setTimeout(() => setStatus("sent"), 1000);
  }

  if (status === "sent") {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Message Sent!</h3>
        <p className="text-[var(--text-secondary)]">We&apos;ll get back to you within 24 hours to schedule your free consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="Your name" />
        </div>
        <div>
          <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>Email</label>
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
        <label className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>What do you need?</label>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors resize-none" placeholder="Tell us about your business and what AI could help with..." />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center !rounded-lg">
        {status === "sending" ? "Sending..." : "Book Free Consultation"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
      <p className="text-center text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>No commitment required. We&apos;ll respond within 24 hours.</p>
    </form>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-semibold text-[16px] pr-8 group-hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>{q}</span>
        <span className={`text-[var(--text-muted)] transition-transform duration-300 ${open ? "rotate-45" : ""}`} style={{ fontSize: 24 }}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[300px] pb-5" : "max-h-0"}`}>
        <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed pr-12">{a}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", { y: 80, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.2 });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.8 });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", delay: 1.1 });
      gsap.from(".hero-stat", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.1, delay: 1.3 });
      gsap.from(".free-banner", { y: -20, opacity: 0, duration: 0.6, ease: "power2.out", delay: 1.6 });

      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-card").forEach((el, i) => {
        gsap.to(el, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: i * 0.08, scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-left").forEach((el) => {
        gsap.to(el, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-right").forEach((el) => {
        gsap.to(el, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-fade").forEach((el) => {
        gsap.to(el, { opacity: 1, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" } });
      });
      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((el) => {
        gsap.to(el, { y: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
      gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
        gsap.to(el, { y: -20, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2 } });
      });
      ScrollTrigger.create({ trigger: ".cta-section", start: "top 80%", onEnter: () => { gsap.from(".cta-section .cta-inner", { scale: 0.92, opacity: 0, duration: 1, ease: "power3.out" }); } });
      const marqueeEl = document.querySelector(".marquee-track");
      if (marqueeEl) gsap.to(marqueeEl, { x: "-50%", duration: 20, ease: "none", repeat: -1 });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen">

      {/* ========== NAV ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--charcoal)] flex items-center justify-center text-white font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>R</div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>RebuiltHQ</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-heading)" }}>
            <a href="#services" className="hover:text-[var(--text)] transition-colors">Services</a>
            <a href="#work" className="hover:text-[var(--text)] transition-colors">Work</a>
            <a href="#pricing" className="hover:text-[var(--text)] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[var(--text)] transition-colors">FAQ</a>
          </div>
          <a href="#contact" className="btn-primary !py-2.5 !px-6 !text-sm">
            Free Consultation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-[100vh] flex items-center pt-16 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 dots-bg opacity-40" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 py-32">
          <div className="hero-line mb-4">
            <div className="status-pill"><span className="dot" />3 live integrations deployed</div>
          </div>
          {/* FREE CONSULTATION BANNER */}
          <div className="free-banner mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/20">
              <span className="text-[var(--accent)] text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>First consultation is free</span>
              <span className="text-[var(--text-muted)]">—</span>
              <a href="#contact" className="text-sm text-[var(--accent)] underline underline-offset-2 hover:no-underline" style={{ fontFamily: "var(--font-heading)" }}>Book now</a>
            </div>
          </div>
          <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
            <span className="hero-line block text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] tracking-tight text-[var(--charcoal)]">We integrate AI into</span>
            <span className="hero-line block text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] tracking-tight text-[var(--charcoal)]">your business so you</span>
            <span className="hero-line block text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] tracking-tight" style={{ color: "var(--accent)" }}>don&apos;t have to.</span>
          </h1>
          <p className="hero-sub text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10" style={{ fontFamily: "var(--font-body)" }}>
            RebuiltHQ builds custom AI solutions powered by Anthropic&apos;s Claude — customer support bots, document processors, sales agents, and content engines. Deployed in under two weeks. Your first consultation is on us.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 mb-20">
            <a href="#contact" className="btn-primary text-base">
              Book Free Consultation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#work" className="btn-secondary text-base">See Our Work</a>
          </div>
          <div className="flex flex-wrap gap-12 md:gap-20">
            {[{ value: "3", label: "Live Clients" }, { value: "Free", label: "First Consult" }, { value: "24/7", label: "AI Availability" }, { value: "<2wk", label: "Go-Live Time" }].map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="text-3xl md:text-4xl font-bold text-[var(--charcoal)] mb-1" style={{ fontFamily: "var(--font-mono)" }}>{stat.value}</div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MARQUEE ========== */}
      <section className="py-6 border-y border-[var(--border)] overflow-hidden bg-[var(--bg-warm)]">
        <div className="flex whitespace-nowrap marquee-track">
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} className="mx-10 text-[13px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-medium" style={{ fontFamily: "var(--font-mono)" }}>{logo}</span>
          ))}
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label reveal-text mb-4 parallax-slow">About RebuiltHQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 reveal-text" style={{ fontFamily: "var(--font-display)" }}>
              We help businesses work smarter with AI.
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-[16px] leading-relaxed reveal-text">
              <p>Most businesses know AI can help them — they just don&apos;t know where to start. That&apos;s where we come in. RebuiltHQ is an AI integration agency specializing in Anthropic&apos;s Claude, the most capable AI model for business applications.</p>
              <p>We don&apos;t sell generic chatbots. We build <strong className="text-[var(--text)]">custom AI systems</strong> trained on your data — your products, your policies, your brand voice — and deploy them directly into your existing workflow.</p>
              <p>Whether you need AI-powered customer support for your Shopify store, an intelligent document assistant for your law firm, or an automated sales pipeline for your agency — we build it, deploy it, and maintain it. You focus on your business.</p>
            </div>
          </div>
          <div className="reveal-right">
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Why businesses choose us:</h3>
              {[
                { title: "Custom, not cookie-cutter", desc: "Every integration is built from scratch for your specific business needs." },
                { title: "Claude-native expertise", desc: "We specialize in Anthropic's Claude API — the gold standard for business AI." },
                { title: "Live in under 2 weeks", desc: "No 6-month implementation timelines. We ship fast." },
                { title: "Free first consultation", desc: "We'll analyze your business and show you what's possible — no charge, no obligation." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><div className="glow-line" /></div>

      {/* ========== SERVICES ========== */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="section-label reveal-text mb-4 parallax-slow">Services</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight reveal-text" style={{ fontFamily: "var(--font-display)" }}>
              Six ways we integrate<br />AI into your business
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div key={service.title} className="glass-card rounded-2xl p-8 reveal-card group">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-[36px] font-bold text-[var(--border)]" style={{ fontFamily: "var(--font-mono)", lineHeight: 1 }}>{service.icon}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" className="group-hover:stroke-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{service.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-[14px]">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><div className="glow-line" /></div>

      {/* ========== CASE STUDIES ========== */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="section-label reveal-text mb-4 parallax-slow">Portfolio</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight reveal-text" style={{ fontFamily: "var(--font-display)" }}>Live integrations.<br />Real businesses.</h2>
          </div>
          <div className="space-y-24">
            {CASE_STUDIES.map((study, idx) => (
              <div key={study.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={`parallax-card reveal-card ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <Link href={`/demo/${study.slug}`}>
                    <div className="video-card cursor-pointer group">
                      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-[1]" />
                      <div className="absolute top-5 left-5 z-[3]">
                        <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10" style={{ fontFamily: "var(--font-mono)" }}>{study.type}</span>
                      </div>
                      <div className="absolute bottom-6 left-6 z-[3]">
                        <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{study.name}</h3>
                        <p className="text-white/50 text-xs mt-1" style={{ fontFamily: "var(--font-mono)" }}>{study.metric}</p>
                      </div>
                      <div className="play-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="var(--charcoal)"><polygon points="8,5 20,12 8,19" /></svg></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 z-[3]" style={{ backgroundColor: study.color }} />
                    </div>
                  </Link>
                </div>
                <div className={`${idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className={idx % 2 === 0 ? "reveal-left" : "reveal-right"}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: study.color }} />
                      <span className="section-label !text-[var(--text-muted)]">{study.type}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>{study.name}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-[16px]">{study.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">{study.tags.map((tag) => (<span key={tag} className="tag">{tag}</span>))}</div>
                    <Link href={`/demo/${study.slug}`} className="btn-primary !bg-transparent !text-[var(--text)] !border !border-[var(--border)] hover:!bg-[var(--charcoal)] hover:!text-white hover:!border-[var(--charcoal)]">
                      Try Live Demo <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-32 px-6 bg-[var(--charcoal)] text-white relative overflow-hidden">
        <div className="absolute inset-0 dots-bg opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <p className="section-label reveal-text mb-4 parallax-slow !text-[var(--accent)]">How It Works</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight reveal-text" style={{ fontFamily: "var(--font-display)" }}>From first call to<br />live in four steps.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Free Consultation", desc: "We learn your business, identify where AI adds the most value, and show you what's possible. No charge, no obligation." },
              { step: "02", title: "Build & Train", desc: "We build your custom Claude integration and train it on your data — products, policies, brand voice, workflows." },
              { step: "03", title: "Test & Refine", desc: "You test the system with real scenarios. We iterate until it handles your edge cases perfectly." },
              { step: "04", title: "Deploy & Support", desc: "Go live with monitoring, analytics, and ongoing support. We maintain and improve the system continuously." },
            ].map((item) => (
              <div key={item.step} className="reveal-card">
                <span className="text-[48px] font-bold block mb-4" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.08)" }}>{item.step}</span>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
                <p className="text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label reveal-text mb-4 parallax-slow">Pricing</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 reveal-text" style={{ fontFamily: "var(--font-display)" }}>Simple, transparent pricing.</h2>
            <p className="text-[var(--text-secondary)] text-lg reveal-text">One plan. Everything included. No hidden fees.</p>
          </div>
          <div className="glass-card rounded-2xl p-10 md:p-14 reveal-card max-w-2xl mx-auto">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>$500</span>
              <span className="text-[var(--text-muted)] text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>/month per integration</span>
            </div>
            <p className="text-[var(--text-secondary)] mb-8">Everything you need to run AI-powered operations.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {[
                "Custom Claude AI integration",
                "Trained on your data & brand voice",
                "Embeddable chat widget",
                "Admin dashboard & analytics",
                "Slack/email escalation system",
                "Rate limiting & security hardening",
                "Ongoing maintenance & updates",
                "Priority support via Slack",
                "99.9% uptime SLA",
                "Unlimited conversations",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary flex-1 justify-center">
                Book Free Consultation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎁</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text)]">First consultation is free.</strong> We&apos;ll analyze your business, recommend the right AI setup, and demo it live — no commitment.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><div className="glow-line" /></div>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label reveal-text mb-4 parallax-slow">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight reveal-text" style={{ fontFamily: "var(--font-display)" }}>Common questions.</h2>
          </div>
          <div className="reveal-fade">
            {FAQS.map((faq) => (<FAQItem key={faq.q} q={faq.q} a={faq.a} />))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="cta-section py-32 px-6 bg-[var(--bg-warm)]">
        <div className="cta-inner max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-label mb-4">Get Started</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Your first consultation<br />is <span style={{ color: "var(--accent)" }}>free</span>.
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
                Tell us about your business and we&apos;ll show you exactly how AI can help. No sales pitch, no obligation — just a clear recommendation backed by a live demo.
              </p>
              <div className="space-y-5">
                {[
                  { icon: "📞", title: "30-minute strategy call", desc: "We learn your business and identify where AI adds the most value." },
                  { icon: "🎬", title: "Live demo", desc: "See a working prototype of what your AI integration would look like." },
                  { icon: "📋", title: "Clear proposal", desc: "Get a detailed scope, timeline, and pricing — no surprises." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-16 px-6 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--charcoal)] flex items-center justify-center text-white font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>R</div>
                <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>RebuiltHQ</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm mb-4">
                AI integration agency specializing in Anthropic&apos;s Claude. We build custom AI solutions that make businesses smarter, faster, and more efficient.
              </p>
              <p className="text-[var(--text-muted)] text-xs" style={{ fontFamily: "var(--font-mono)" }}>Powered by Anthropic Claude</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>Services</h4>
              <div className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                <a href="#services" className="block hover:text-[var(--text)] transition-colors">Customer Support AI</a>
                <a href="#services" className="block hover:text-[var(--text)] transition-colors">Document Processing</a>
                <a href="#services" className="block hover:text-[var(--text)] transition-colors">Sales Automation</a>
                <a href="#services" className="block hover:text-[var(--text)] transition-colors">Content Generation</a>
                <a href="#services" className="block hover:text-[var(--text)] transition-colors">Custom Integrations</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>Company</h4>
              <div className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                <a href="#work" className="block hover:text-[var(--text)] transition-colors">Case Studies</a>
                <a href="#pricing" className="block hover:text-[var(--text)] transition-colors">Pricing</a>
                <a href="#faq" className="block hover:text-[var(--text)] transition-colors">FAQ</a>
                <a href="#contact" className="block hover:text-[var(--text)] transition-colors">Contact</a>
                <Link href="/admin" className="block hover:text-[var(--text)] transition-colors">Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>&copy; 2026 RebuiltHQ. All rights reserved.</span>
            <div className="flex gap-6 text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <a href="mailto:hello@rebuilthq.com" className="hover:text-[var(--text)] transition-colors">hello@rebuilthq.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
