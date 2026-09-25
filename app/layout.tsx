import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VULTURE — Voice-First, Time-Aware Group Broadcasting",
  description: "Information has a half-life. Voice-first broadcasts for small groups with AI priority and decay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e0e0e] text-[#f1f1ef] min-h-screen flex flex-col antialiased selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
        {children}
      </body>
    </html>
  );
}
