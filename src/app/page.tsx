import Link from "next/link";

const CASE_STUDIES = [
  {
    slug: "ntrl",
    name: "NTRL Diffuser Co",
    type: "AI Customer Support",
    description:
      "Deployed a Claude-powered support agent handling product questions, order tracking, and seamless human escalation for a botanical diffuser brand.",
    tags: ["Shopify", "Chat Widget", "Order Tracking", "Escalation"],
    metric: "24/7 support coverage",
    color: "#22c55e",
  },
  {
    slug: "ramezghalylaw",
    name: "Ramez Ghaly Law",
    type: "AI Document Processing",
    description:
      "Built an intelligent document assistant that analyzes legal contracts, extracts key clauses, and answers questions in plain language.",
    tags: ["PDF Analysis", "RAG", "Summarization", "Legal"],
    metric: "90% faster document review",
    color: "#3b82f6",
  },
  {
    slug: "rebuilthq",
    name: "RebuiltHQ",
    type: "AI Sales + Content Engine",
    description:
      "Our own site runs on what we sell — a sales chatbot that qualifies leads and a content engine generating ad copy, SEO, and social posts.",
    tags: ["Lead Qualification", "Content Generation", "Sales Bot"],
    metric: "Self-hosted proof of concept",
    color: "#8b5cf6",
  },
];

const SERVICES = [
  {
    icon: "💬",
    title: "AI Customer Support",
    description: "Claude-powered chat agents that know your products, track orders, and escalate to humans when needed.",
  },
  {
    icon: "📄",
    title: "Document Processing",
    description: "Upload contracts, invoices, or reports. AI extracts data, summarizes, and answers questions instantly.",
  },
  {
    icon: "🎯",
    title: "Sales & Lead Qualification",
    description: "Intelligent chatbots that engage visitors, qualify leads, and feed your pipeline 24/7.",
  },
  {
    icon: "✍️",
    title: "Content Generation",
    description: "Ad copy, SEO content, social posts, and email campaigns — all generated from your brand voice.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              R
            </div>
            <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              RebuiltHQ
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-heading)" }}>
            <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
            <a href="#work" className="hover:text-[var(--text-primary)] transition-colors">Work</a>
            <a href="#demo" className="hover:text-[var(--text-primary)] transition-colors">Live Demo</a>
            <Link href="/admin" className="hover:text-[var(--text-primary)] transition-colors">Admin</Link>
          </div>
          <a href="#contact" className="btn-glow text-sm !py-2.5 !px-5">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500 opacity-[0.03] blur-[100px] animate-float" style={{ animationDelay: "3s" }} />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <p
              className="text-sm tracking-[0.3em] uppercase text-[var(--text-muted)] mb-6"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              AI Integration Agency
            </p>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 animate-fade-in-up delay-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We make your
            <br />
            business{" "}
            <span className="gradient-text">intelligent</span>
          </h1>

          <p
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 animate-fade-in-up delay-400 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            RebuiltHQ integrates Claude AI into your business — from customer support
            and document processing to sales automation and content generation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-600">
            <a href="#work" className="btn-glow text-base">
              See Our Work
            </a>
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all text-base font-medium"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Try Live Demo
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in-up delay-800">
            {[
              { value: "3", label: "Live Integrations" },
              { value: "24/7", label: "AI Availability" },
              { value: "$500", label: "Starting /mo" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-mono)" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glow-line mb-16" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                What We Build
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Services
              </h2>
            </div>
            <p className="text-[var(--text-secondary)] max-w-md text-right">
              Every integration is powered by Anthropic&apos;s Claude — the most capable AI for business applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="glass-card rounded-2xl p-8 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {service.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="work" className="py-32 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="glow-line mb-16" />
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Live Integrations
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <Link
                key={study.slug}
                href={`/demo/${study.slug}`}
                className="glass-card rounded-2xl p-8 flex flex-col group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: study.color, boxShadow: `0 0 12px ${study.color}40` }}
                  />
                  <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                    {study.type}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {study.name}
                </h3>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">
                  {study.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="text-sm font-medium" style={{ color: study.color, fontFamily: "var(--font-mono)" }}>
                    {study.metric}
                  </span>
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors text-sm">
                    View Demo →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glow-line mb-16" />
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            Try It Now
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Live Demo
          </h2>
          <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
            Experience our AI integrations firsthand. Each demo is a real, working system — not a mockup.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <Link
                key={study.slug}
                href={`/demo/${study.slug}`}
                className="glass-card rounded-xl p-6 text-center hover:border-[var(--accent)]/30 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: `${study.color}20`, color: study.color, fontFamily: "var(--font-mono)" }}
                >
                  {study.name[0]}
                </div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {study.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {study.type}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-32 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ready to{" "}
            <span className="gradient-text">rebuild</span>
            ?
          </h2>
          <p className="text-[var(--text-secondary)] mb-12 text-lg">
            Starting at $500/month. We&apos;ll build your custom AI integration in weeks, not months.
          </p>
          <a href="mailto:hello@rebuilthq.com" className="btn-glow text-lg !py-4 !px-10">
            Let&apos;s Talk
          </a>
          <p className="text-[var(--text-muted)] text-sm mt-6" style={{ fontFamily: "var(--font-mono)" }}>
            Powered by Anthropic Claude
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center text-xs font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              R
            </div>
            <span className="text-sm text-[var(--text-muted)]">RebuiltHQ &copy; 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
            <span>AI Integration Agency</span>
            <span>Anthropic Partner</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
