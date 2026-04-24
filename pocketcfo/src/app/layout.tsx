import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PocketCFO — AI Decision Intelligence for Malaysian SMEs",
  description:
    "Your AI-powered CFO that navigates LHDN e-invoicing mandates, optimizes cash flow, and makes strategic tax decisions for Malaysian SMEs. Powered by Z.AI GLM-5.",
  keywords: [
    "PocketCFO",
    "Malaysian SME",
    "LHDN",
    "e-invoice",
    "tax optimization",
    "AI CFO",
    "Decision Intelligence",
  ],
  authors: [{ name: "PocketCFO Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
