export type Accent = "cyan" | "violet" | "emerald" | "amber" | "lime";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  year: string;
  featured: boolean;
  url: string;
  /** Short label shown at the top of the card */
  category: string;
  /** Call-to-action label for the card button */
  cta: string;
  /** Accent colour used for the card's glow and button */
  accent: Accent;
  /** Optional public source repository */
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "talent-match-ai",
    title: "Talent Match AI",
    tagline: "AI powered talent matching from your CV",
    description:
      "A recommendation system that matches candidates to roles using embedding based similarity and structured scoring, built as an end to end deployable product. Covers resume screening, candidate ranking and an interview assistant.",
    tags: ["Machine Learning", "Recommendation Systems", "Resume Screening", "Product"],
    year: "2025",
    featured: true,
    url: "https://talentmatch-ai-frontend.vercel.app/",
    category: "Recommendation Systems",
    cta: "Try Talent Match AI",
    accent: "emerald",
    repo: "https://github.com/Mc-KellyTPepple/TalentMatch-AI",
  },
  {
    slug: "ask-your-files",
    title: "Ask Your Files (RAG)",
    tagline: "Document Q&A with sources you can check",
    description:
      "Upload PDFs, Office files, spreadsheets, web pages or images and ask questions. Hybrid vector and keyword search with reranking, OCR for scans, and numbered citations, running on free hosting with a frontend that hides cold starts.",
    tags: ["RAG", "pgvector", "FastAPI", "Reranking", "OCR", "Supabase"],
    year: "2026",
    featured: true,
    url: "/ask-your-files",
    category: "Retrieval & Full-Stack",
    cta: "See how it works",
    accent: "cyan",
    repo: "https://github.com/Mc-KellyTPepple/rag-platform",
  },
  {
    slug: "lightface-ai",
    title: "LightFace AI",
    tagline: "Lightweight Hybrid Face Verification Engine",
    description:
      "A fast, privacy-conscious facial verification system powered by MobileFaceNet and ONNX Runtime CPU inference, with INT8 quantization for a memory-efficient verification API.",
    tags: ["MobileFaceNet", "ONNX Runtime", "INT8 Quantization", "Computer Vision", "Python", "Next.js"],
    year: "2026",
    featured: true,
    url: "https://lightface-hybrid-ai.vercel.app/",
    category: "Computer Vision",
    cta: "Try LightFace AI",
    accent: "cyan",
    repo: "https://github.com/Mc-KellyTPepple/lightface-hybrid-api",
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker (Mobile & Web)",
    tagline: "Installable habit tracker with push reminders that stop on delivery",
    description:
      "An installable habit tracker for phone and desktop that sends three push reminders a day and stops the moment one is delivered. Static frontend, Supabase pg_cron and Edge Functions, so nothing sleeps and idle time costs almost nothing.",
    tags: ["PWA", "Web Push", "Supabase", "pg_cron", "Edge Functions"],
    year: "2026",
    featured: true,
    url: "/habit-tracker",
    category: "Full-Stack & PWA",
    cta: "Try Habit Tracker",
    accent: "violet",
    repo: "https://github.com/Mc-KellyTPepple/habit-pings",
  },
  {
    slug: "animal-image-classifier",
    title: "Animal Image Classifier",
    tagline: "Deployed cat, dog, and bird image classifier",
    description:
      "A production ready image classification pipeline covering data preprocessing, model training, and deployment for real time inference.",
    tags: ["Computer Vision", "Classification", "Deployment"],
    year: "2024",
    featured: true,
    url: "/animal-classifier",
    category: "Computer Vision",
    cta: "Try the classifier",
    accent: "amber",
    repo: "https://github.com/Mc-KellyTPepple/my-first-ai-image-classifier",
  },
  {
    slug: "plant-disease-detection",
    title: "Plant Disease Detection AI",
    tagline: "Computer vision for plant disease",
    description:
      "A deep learning classifier built on MobileNetV3-Large that identifies plant diseases from leaf images, served with ONNX Runtime as a lightweight application for real world agricultural use.",
    tags: ["Computer Vision", "MobileNetV3", "ONNX Runtime", "Deployment"],
    year: "2024",
    featured: true,
    url: "/plant-disease",
    category: "Computer Vision",
    cta: "Try the detector",
    accent: "lime",
    repo: "https://github.com/Mc-KellyTPepple/plant-disease-diagnosis",
  },
];
