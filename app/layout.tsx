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
  title: "Mc-Kelly Pepple | AI / ML Engineer & Full Stack Developer",
  description:
    "Mc-Kelly Pepple is an AI / ML engineer, full stack developer and computer vision specialist building and deploying scalable intelligent applications with PyTorch, Python, React and Node.js.",
  keywords: [
    "Mc-Kelly Pepple",
    "AI / ML Engineer",
    "AI Engineer",
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
    title: "Mc-Kelly Pepple | AI / ML Engineer & Full Stack Developer",
    description:
      "AI / ML engineer and full stack developer building and deploying scalable intelligent applications.",
    type: "website",
    siteName: "Mc-Kelly Pepple",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mc-Kelly Pepple | AI / ML Engineer & Full Stack Developer",
    description:
      "AI / ML engineer and full stack developer building and deploying scalable intelligent applications.",
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