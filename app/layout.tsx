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
  title: "Mc-Kelly Pepple | AI Engineer & Machine Learning Developer",
  description:
    "Portfolio of Mc-Kelly Pepple, an AI engineer specializing in machine learning, computer vision, and deployable AI systems including resume-job matching, image classification, and plant disease detection.",
  keywords: [
    "Mc-Kelly Pepple",
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "AI Portfolio",
  ],
  authors: [{ name: "Mc-Kelly Pepple" }],
  openGraph: {
    title: "Mc-Kelly Pepple | AI Engineer & Machine Learning Developer",
    description:
      "AI engineer building practical, deployable machine learning systems.",
    type: "website",
    siteName: "Mc-Kelly Pepple",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mc-Kelly Pepple | AI Engineer & Machine Learning Developer",
    description:
      "AI engineer building practical, deployable machine learning systems.",
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