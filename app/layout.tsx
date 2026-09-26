import type { Metadata } from "next";
import "./globals.css";
import { ScreenFlashOverlay } from "@/components/ui/ScreenFlashOverlay";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "VULTURE // Voice-First Tactical Squad Broadcasting",
  description:
    "Information has a half-life. Voice-first emergency squad broadcasts with ElevenLabs Scribe, Google Gemini 3.5 urgency triage, and automatic temporal decay.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "VULTURE // Voice-First Tactical Squad Broadcasting",
    description:
      "Information has a half-life. Voice-first emergency squad broadcasts with ElevenLabs Scribe, Google Gemini 3.5 urgency triage, and automatic temporal decay.",
    url: "/",
    siteName: "VULTURE Protocol",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "VULTURE Protocol — Voice-First Squad Broadcasting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VULTURE // Voice-First Tactical Squad Broadcasting",
    description:
      "Information has a half-life. Voice-first emergency squad broadcasts with ElevenLabs Scribe, Google Gemini 3.5 urgency triage, and automatic temporal decay.",
    images: ["/og_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#08090b] text-[#f8f8f6] min-h-screen flex flex-col antialiased selection:bg-[#d4f65b] selection:text-[#08090b]"
        suppressHydrationWarning
      >
        {children}
        <ScreenFlashOverlay />
      </body>
    </html>
  );
}
