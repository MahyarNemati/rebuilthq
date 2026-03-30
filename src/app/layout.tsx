import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RebuiltHQ — AI Integration Agency",
  description:
    "We build Claude-powered AI solutions for businesses. Customer support, document processing, sales automation, and content generation.",
  openGraph: {
    title: "RebuiltHQ — AI Integration Agency",
    description: "Claude-powered AI solutions for businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
