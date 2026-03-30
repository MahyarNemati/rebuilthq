import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export const metadata = { title: "NTRL AI Support Demo — RebuiltHQ" };

export default function NTRLDemo() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="border-b border-[var(--border)] px-6 h-14 flex items-center justify-between bg-white">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>RebuiltHQ</span>
        </Link>
        <div className="status-pill">
          <span className="dot" />
          Live Demo
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span className="section-label !text-[#2E7D32]">AI Customer Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              NTRL Diffuser Co
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              A Claude-powered support agent deployed on ntrldiffuserco.com. Handles product
              questions, shipping inquiries, order tracking, and escalation to humans.
            </p>
            <div className="space-y-3 mb-10">
              {[
                "Product knowledge — knows all 5 SKUs, ingredients, pricing",
                "Order tracking — looks up orders by email + order number",
                "Smart recommendations — suggests products based on preferences",
                "Human escalation — seamlessly hands off when needed",
                "24/7 availability — never misses a customer question",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="text-[#2E7D32] mt-0.5 text-sm">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Try asking:</h3>
              <div className="space-y-2 text-sm text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                <p>&quot;What flavors do you have?&quot;</p>
                <p>&quot;How long does shipping take to Ontario?&quot;</p>
                <p>&quot;What are your diffusers made of?&quot;</p>
                <p>&quot;I want to speak to someone&quot;</p>
              </div>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <ChatWidget tenantSlug="ntrl" primaryColor="#2E7D32" greeting="Hey! 👋 Welcome to NTRL Diffuser Co. I can help you with products, orders, or anything else. What's on your mind?" title="NTRL Support" embedded />
          </div>
        </div>
      </div>
    </div>
  );
}
