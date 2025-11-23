import type { Metadata } from "next";
import { Stack_Sans_Headline } from "next/font/google";
import "./globals.css";

const stackSans = Stack_Sans_Headline({
  variable: "--font-stackSans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataKnow - Intelligent Document Analysis",
  description: "Upload multiple documents and get AI-powered summaries, intelligent classification, and consolidated insights in one beautiful interface.",
  keywords: "document analysis, AI, PDF, Word, Excel, text processing, data extraction",
  authors: [{ name: "DataKnow" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "DataKnow - Intelligent Document Analysis",
    description: "AI-powered document analysis with multi-format support and intelligent insights",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataKnow - Intelligent Document Analysis",
    description: "AI-powered document analysis with multi-format support and intelligent insights",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${stackSans.variable} font-sans antialiased bg-white text-slate-900`}>
        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Global Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-blue-50/30" />
        </div>
      </body>
    </html>
  );
}