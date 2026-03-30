import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export const metadata = {
  title: "NTRL AI Support Demo — RebuiltHQ",
};

export default function NTRLDemo() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <span>←</span>
          <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>Back to RebuiltHQ</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: "0 0 12px #22c55e40" }} />
          <span className="text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>Live Demo</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                AI Customer Support
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              NTRL Diffuser Co
            </h1>

            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              A Claude-powered support agent deployed on ntrldiffuserco.com. Handles product
              questions, shipping inquiries, order tracking, and escalation to humans.
            </p>

            <div className="space-y-4 mb-12">
              <h3 className="text-sm tracking-[0.2em] uppercase text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                Capabilities
              </h3>
              {[
                "Product knowledge — knows all 5 SKUs, ingredients, pricing",
                "Order tracking — looks up orders by email + order number",
                "Smart recommendations — suggests products based on preferences",
                "Human escalation — seamlessly hands off when needed",
                "24/7 availability — never misses a customer question",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Try asking:
              </h3>
              <div className="space-y-2 text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                <p>&quot;What flavors do you have?&quot;</p>
                <p>&quot;How long does shipping take to Ontario?&quot;</p>
                <p>&quot;What are your diffusers made of?&quot;</p>
                <p>&quot;I want to speak to someone&quot;</p>
              </div>
            </div>
          </div>

          {/* Right — Chat */}
          <div className="lg:sticky lg:top-24">
            <ChatWidget
              tenantSlug="ntrl"
              primaryColor="#22c55e"
              greeting="Hey! 👋 Welcome to NTRL Diffuser Co. I can help you with products, orders, or anything else. What's on your mind?"
              title="NTRL Support"
              embedded
            />
          </div>
        </div>
      </div>
    </div>
  );
}
