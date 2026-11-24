import type { MetadataRoute } from "next";

const BASE = "https://mckelly-pepple.vercel.app";
const PAGES = [
  "",
  "animal-classifier",
  "ask-your-files",
  "data-analyst",
  "doc-extract",
  "edgar-analyst",
  "habit-tracker",
  "model-lab",
  "plant-disease",
  "voice-to-tasks",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: p ? `${BASE}/${p}` : BASE,
    lastModified: new Date(),
  }));
}
