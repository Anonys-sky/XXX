import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PocketCFO - SME Strategist",
  description:
    "Your AI-powered CFO that navigates LHDN e-invoicing mandates, optimizes cash flow, and makes strategic tax decisions for Malaysian SMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
