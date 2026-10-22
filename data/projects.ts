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
    tagline: "React Native, React & Supabase Full-Stack Habit Tracker",
    description:
      "A full-stack habit tracker for Android and the web, built with React Native (Expo), React and Supabase, featuring authentication, habit tracking, and retrying push reminders sent from a Node.js service on Render.",
    tags: ["React Native", "React", "Expo", "Supabase", "Node.js", "Web Push"],
    year: "2026",
    featured: true,
    url: "/habit-tracker",
    category: "Mobile & Full-Stack",
    cta: "Try Habit Tracker",
    accent: "violet",
    repo: "https://github.com/Mc-KellyPepple/habit-tracker",
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
    url: "https://my-first-ai-image-classifier.onrender.com/",
    category: "Computer Vision",
    cta: "View Live Project",
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
    url: "https://plant-disease-diagnosis-alvy.onrender.com/",
    category: "Computer Vision",
    cta: "View Live Project",
    accent: "lime",
    repo: "https://github.com/Mc-KellyTPepple/plant-disease-diagnosis",
  },
];
