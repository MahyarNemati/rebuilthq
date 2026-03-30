"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatWidgetProps = {
  tenantSlug: string;
  primaryColor?: string;
  greeting?: string;
  title?: string;
  embedded?: boolean;
};

export default function ChatWidget({
  tenantSlug,
  primaryColor = "#FF5722",
  greeting = "Hi! How can I help you today?",
  title = "AI Assistant",
  embedded = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_HOST}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          sessionId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), role: "assistant", content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const chatWindow = (
    <div
      className={`flex flex-col overflow-hidden shadow-2xl ${
        embedded ? "w-full h-[600px] rounded-2xl border border-[var(--border)]" : "w-[380px] h-[520px] rounded-2xl"
      }`}
      style={{ background: "#FFFFFF" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border)", background: `${primaryColor}08` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: primaryColor, fontFamily: "var(--font-mono)" }}
          >
            AI
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </div>
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Online
            </div>
          </div>
        </div>
        {!embedded && (
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--bg)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-br-md"
                  : "bg-white text-[var(--text)] rounded-bl-md border border-[var(--border)]"
              }`}
              style={msg.role === "user" ? { backgroundColor: primaryColor } : undefined}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--border-hover)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--border-hover)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--border-hover)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-[var(--border)]">
        <div className="flex gap-2 items-center bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-1 focus-within:border-[var(--border-hover)] transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none py-2.5"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: input.trim() ? primaryColor : "var(--border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2" style={{ fontFamily: "var(--font-mono)" }}>
          Powered by RebuiltHQ + Claude
        </p>
      </div>
    </div>
  );

  if (embedded) return chatWindow;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 z-50"
          style={{ backgroundColor: primaryColor, boxShadow: `0 8px 30px ${primaryColor}40` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50" style={{ animation: "fadeInUp 0.3s ease forwards" }}>
          {chatWindow}
        </div>
      )}
    </>
  );
}
