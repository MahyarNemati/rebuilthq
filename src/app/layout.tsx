import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RebuiltHQ — AI Integration Agency",
  description:
    "We build Claude-powered AI solutions for businesses. Customer support, document processing, sales automation, and content generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
