"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CASE_STUDIES = [
  {
    slug: "ntrl",
    name: "NTRL Diffuser Co",
    type: "AI Customer Support",
    description:
      "Claude-powered support agent handling product questions, order tracking, and seamless human escalation for a botanical diffuser brand.",
    tags: ["Shopify", "Chat Widget", "Order Tracking", "Escalation"],
    metric: "24/7 automated support",
    color: "#2E7D32",
    videoPlaceholder: "Customer chats with AI about diffuser flavors, gets instant order tracking, smooth handoff to human agent",
  },
  {
    slug: "ramezghalylaw",
    name: "Ramez Ghaly Law",
    type: "AI Document Processing",
    description:
      "Intelligent document assistant analyzing legal contracts, extracting key clauses, and answering questions in plain language.",
    tags: ["PDF Analysis", "RAG", "Summarization", "Legal"],
    metric: "90% faster document review",
    color: "#1565C0",
    videoPlaceholder: "Lawyer uploads contract PDF, AI instantly extracts key dates, obligations, and flags unusual clauses",
  },
  {
    slug: "rebuilthq",
    name: "RebuiltHQ",
    type: "AI Sales + Content Engine",
    description:
      "Our own site runs what we sell — sales chatbot qualifying leads and a content engine generating ad copy, SEO, and social posts.",
    tags: ["Lead Qualification", "Content Generation", "Sales Bot"],
    metric: "Self-hosted proof of concept",
    color: "#FF5722",
    videoPlaceholder: "Visitor asks about AI services, chatbot qualifies them as a lead, captures details, notifies sales via Slack",
  },
];

const SERVICES = [
  {
    icon: "01",
    title: "Customer Support Agents",
    description: "Claude-powered chat agents that know your products, track orders, and escalate to humans when needed. Embeddable on any site.",
  },
  {
    icon: "02",
    title: "Document Processing",
    description: "Upload contracts, invoices, or reports. AI extracts data, summarizes key points, and answers questions instantly.",
  },
  {
    icon: "03",
    title: "Sales & Lead Qualification",
    description: "Intelligent chatbots that engage visitors, qualify leads, capture contact info, and feed your pipeline around the clock.",
  },
  {
    icon: "04",
    title: "Content Generation",
    description: "Ad copy, SEO content, social posts, and email campaigns — all generated from your brand voice and product data.",
  },
];

const LOGOS = ["Anthropic", "Claude API", "Shopify", "Vercel", "PostgreSQL", "TypeScript"];

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text stagger
      gsap.from(".hero-line", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });

      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.8,
      });

      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.1,
      });

      gsap.from(".hero-stat", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 1.3,
      });

      // Scroll-triggered reveals
      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-card").forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-left").forEach((el) => {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-right").forEach((el) => {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-fade").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      // Parallax on case study video cards
      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((el) => {
        gsap.to(el, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Parallax on section labels
      gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
        gsap.to(el, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // Scale-up for the big CTA section
      ScrollTrigger.create({
        trigger: ".cta-section",
        start: "top 80%",
        onEnter: () => {
          gsap.from(".cta-section .cta-inner", {
            scale: 0.92,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });

      // Horizontal marquee
      const marqueeEl = document.querySelector(".marquee-track");
      if (marqueeEl) {
        gsap.to(marqueeEl, {
          x: "-50%",
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* ========== NAV ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg bg-[var(--charcoal)] flex items-center justify-center text-white font-bold text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              R
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              RebuiltHQ
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[14px] text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-heading)" }}>
            <a href="#services" className="hover:text-[var(--text)] transition-colors">Services</a>
            <a href="#work" className="hover:text-[var(--text)] transition-colors">Work</a>
            <a href="#demo" className="hover:text-[var(--text)] transition-colors">Live Demos</a>
            <Link href="/admin" className="hover:text-[var(--text)] transition-colors">Dashboard</Link>
          </div>

          <a href="#contact" className="btn-primary !py-2.5 !px-6 !text-sm">
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-[100vh] flex items-center pt-16 mesh-gradient overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 dots-bg opacity-40" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 py-32">
          {/* Status pill */}
          <div className="hero-line mb-8">
            <div className="status-pill">
              <span className="dot" />
              3 live integrations deployed
            </div>
          </div>

          {/* Main headline */}
          <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
            <span className="hero-line block text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight text-[var(--charcoal)]">
              We make businesses
            </span>
            <span className="hero-line block text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight" style={{ color: "var(--accent)" }}>
              intelligent.
            </span>
          </h1>

          <p
            className="hero-sub text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            RebuiltHQ integrates Claude AI into your business — customer support,
            document processing, sales automation, and content generation.
            All from one platform.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 mb-20">
            <a href="#work" className="btn-primary text-base">
              See Our Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#demo" className="btn-secondary text-base">
              Try Live Demos
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-12 md:gap-20">
            {[
              { value: "3", label: "Live Integrations" },
              { value: "$500", label: "Starting / month" },
              { value: "24/7", label: "AI Availability" },
              { value: "<2wk", label: "Deployment Time" },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div
                  className="text-3xl md:text-4xl font-bold text-[var(--charcoal)] mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TECH MARQUEE ========== */}
      <section className="py-6 border-y border-[var(--border)] overflow-hidden bg-[var(--bg-warm)]">
        <div className="flex whitespace-nowrap marquee-track">
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={i}
              className="mx-10 text-[13px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="section-label reveal-text mb-4 parallax-slow">What We Build</p>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-tight reveal-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Four ways we make
              <br />
              your business smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="glass-card rounded-2xl p-8 md:p-10 reveal-card group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-[40px] font-bold text-[var(--border)]"
                    style={{ fontFamily: "var(--font-mono)", lineHeight: 1 }}
                  >
                    {service.icon}
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                    className="group-hover:stroke-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                <h3
                  className="text-xl md:text-2xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DIVIDER ========== */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="glow-line" />
      </div>

      {/* ========== CASE STUDIES WITH VIDEO CARDS ========== */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="section-label reveal-text mb-4 parallax-slow">Portfolio</p>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-tight reveal-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Live integrations.
              <br />
              Real businesses.
            </h2>
          </div>

          <div className="space-y-24">
            {CASE_STUDIES.map((study, idx) => (
              <div
                key={study.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  idx % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Video card */}
                <div className={`parallax-card reveal-card ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <Link href={`/demo/${study.slug}`}>
                    <div className="video-card cursor-pointer group">
                      {/* Animated noise inside card */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                          backgroundSize: "200px 200px",
                        }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-[1]" />
                      {/* Type label */}
                      <div className="absolute top-5 left-5 z-[3]">
                        <span
                          className="text-[11px] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {study.type}
                        </span>
                      </div>
                      {/* Company name overlay */}
                      <div className="absolute bottom-6 left-6 z-[3]">
                        <h3
                          className="text-white text-2xl md:text-3xl font-bold tracking-tight"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {study.name}
                        </h3>
                        <p
                          className="text-white/50 text-xs mt-1"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {study.metric}
                        </p>
                      </div>
                      {/* Play button */}
                      <div className="play-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--charcoal)">
                          <polygon points="8,5 20,12 8,19" />
                        </svg>
                      </div>
                      {/* Accent color bar */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1 z-[3]"
                        style={{ backgroundColor: study.color }}
                      />
                    </div>
                  </Link>
                </div>

                {/* Info */}
                <div className={`${idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className={idx % 2 === 0 ? "reveal-left" : "reveal-right"}>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: study.color }}
                      />
                      <span className="section-label !text-[var(--text-muted)]">{study.type}</span>
                    </div>

                    <h3
                      className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {study.name}
                    </h3>

                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-[16px]">
                      {study.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {study.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>

                    <Link
                      href={`/demo/${study.slug}`}
                      className="btn-primary !bg-transparent !text-[var(--text)] !border !border-[var(--border)] hover:!bg-[var(--charcoal)] hover:!text-white hover:!border-[var(--charcoal)]"
                    >
                      View Live Demo
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
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
            <p className="section-label reveal-text mb-4 parallax-slow !text-[var(--accent)]">Process</p>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-tight reveal-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From zero to live
              <br />
              in under two weeks.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "We learn your business, products, and customer needs." },
              { step: "02", title: "Build", desc: "Custom Claude integration tailored to your workflows." },
              { step: "03", title: "Train", desc: "AI learns your products, policies, and brand voice." },
              { step: "04", title: "Deploy", desc: "Go live with monitoring, analytics, and support." },
            ].map((item) => (
              <div key={item.step} className="reveal-card">
                <span
                  className="text-[48px] font-bold block mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.08)" }}
                >
                  {item.step}
                </span>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LIVE DEMOS ========== */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="section-label reveal-text mb-4 parallax-slow">Interactive</p>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 reveal-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Try it yourself.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-14 max-w-xl mx-auto reveal-text">
            Every demo is a real, working system powered by Claude — not a mockup.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <Link
                key={study.slug}
                href={`/demo/${study.slug}`}
                className="glass-card rounded-2xl p-8 text-center reveal-card group"
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${study.color}12`,
                    color: study.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {study.name[0]}
                </div>
                <h3
                  className="font-bold text-lg mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {study.name}
                </h3>
                <p
                  className="text-[12px] text-[var(--text-muted)] mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {study.type}
                </p>
                <span
                  className="text-[13px] text-[var(--accent)] font-medium group-hover:underline"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Launch Demo →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section id="contact" className="cta-section py-32 px-6 bg-[var(--bg-warm)]">
        <div className="cta-inner max-w-4xl mx-auto text-center">
          <h2
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to{" "}
            <span style={{ color: "var(--accent)" }}>rebuild</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-lg mx-auto">
            Starting at $500/month. Custom AI integration deployed to your business in under two weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@rebuilthq.com" className="btn-primary text-lg !py-4 !px-10">
              Start a Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#work" className="btn-secondary text-lg !py-4 !px-10">
              See Case Studies
            </a>
          </div>
          <p
            className="text-[var(--text-muted)] text-xs mt-10 tracking-[0.1em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            POWERED BY ANTHROPIC CLAUDE &bull; BUILT BY REBUILTHQ
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded bg-[var(--charcoal)] flex items-center justify-center text-white text-[10px] font-bold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              R
            </div>
            <span className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-heading)" }}>
              RebuiltHQ &copy; 2026
            </span>
          </div>
          <div className="flex gap-8 text-[12px] text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
            <a href="#services" className="hover:text-[var(--text)] transition-colors">Services</a>
            <a href="#work" className="hover:text-[var(--text)] transition-colors">Work</a>
            <a href="#demo" className="hover:text-[var(--text)] transition-colors">Demos</a>
            <span>Anthropic Partner</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
