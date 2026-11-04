import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-portfolio-pearl-ten.vercel.app"),
  alternates: { canonical: "/" },
  title: "Mc-Kelly Pepple | Applied AI / AI Systems Engineer",
  description:
    "Mc-Kelly Pepple is an Applied AI / AI Systems Engineer working on LLMs, AI agents and multimodal AI, RAG, computer vision and full-stack AI, with Python, PyTorch and React.",
  keywords: [
    "Mc-Kelly Pepple",
    "Applied AI Engineer",
    "AI Systems Engineer",
    "AI / ML Engineer",
    "LLMs",
    "AI Agents",
    "Multimodal AI",
    "RAG",
    "Full Stack Developer",
    "Machine Learning",
    "Computer Vision",
    "PyTorch",
    "Python",
    "React",
    "Node.js",
    "AI Portfolio",
  ],
  authors: [{ name: "Mc-Kelly Pepple" }],
  openGraph: {
    title: "Mc-Kelly Pepple | Applied AI / AI Systems Engineer",
    description:
      "Applied AI / AI Systems Engineer: LLMs, AI agents & multimodal AI, RAG, computer vision and full-stack AI with Python, PyTorch and React.",
    type: "website",
    siteName: "Mc-Kelly Pepple",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mc-Kelly Pepple | Applied AI / AI Systems Engineer",
    description:
      "Applied AI / AI Systems Engineer: LLMs, AI agents & multimodal AI, RAG, computer vision and full-stack AI with Python, PyTorch and React.",
  },
  verification: {
    google: "fR1I8jNBDh7PwOcMsCwIoKaZrSWpOYy8yc1ZCCEg3ag",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}