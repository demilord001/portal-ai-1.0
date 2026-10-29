import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal.AI - Ultra-Fast Next-Gen AI Assistant & Intelligent Gateway",
  description:
    "Next-generation AI assistant engineered for instant real-time reasoning, dynamic greetings, live web intelligence, 3D fluid neural visualizer, and multimodal attachments.",
  keywords: ["Portal.AI", "AI Assistant", "Fast AI", "Multimodal AI", "3D Visualizer", "Next.js", "Demlabs Inc"],
  icons: {
    icon: "/favicon.ico",
  },
};

const isClerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("example.clerk") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isClerkConfigured) {
    return (
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-[#0e0f14] text-[#e3e3e3] antialiased selection:bg-indigo-500/30 selection:text-white">
          {children}
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-[#0e0f14] text-[#e3e3e3] antialiased selection:bg-indigo-500/30 selection:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
