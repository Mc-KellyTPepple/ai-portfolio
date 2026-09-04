import type { Metadata } from "next";
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
  },
};