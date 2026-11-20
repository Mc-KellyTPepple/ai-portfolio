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
        slug: "sentinel-vision",
        title: "Sentinel Vision",
        tagline: "Real-time AI video intelligence with alerts you can explain",
        description:
                "Upload a clip or use your webcam to detect and track people and objects with YOLO11 and ByteTrack. Draw zones and counting lines, get alerts for loitering, running, falls and objects left behind, ask questions about any video, and review incidents with evidence frames and an audit trail.",
        tags: ["Computer Vision", "YOLO11", "Object Tracking", "FastAPI", "Next.js", "Supabase"],
        year: "2026",
        featured: true,
        url: "https://sentinel-vision-indol.vercel.app/",
        category: "Computer Vision & Video AI",
        cta: "Try Sentinel Vision",
        accent: "lime",
        repo: "https://github.com/Mc-KellyTPepple/sentinel-vision",
  },
  {
    slug: "doc-extract",
    title: "Doc Extract",
    tagline: "Receipts to structured data, flagged when the numbers do not add up",
    description:
      "A vision model reads a receipt or invoice into JSON, and an arithmetic validator checks that the lines, subtotal, tax and total agree, re-reading once if they do not and flagging what still fails. Measured on the public CORD receipt set against OCR baselines, with the failures reported. Groq-hosted models, cloud hosting.",
    tags: ["Multimodal AI", "Document AI", "Vision LLM", "Validation", "Groq", "GitHub Actions"],
    year: "2026",
    featured: true,
    url: "/doc-extract",
    category: "Multimodal AI & Documents",
    cta: "Extract a receipt",
    accent: "cyan",
    repo: "https://github.com/Mc-KellyTPepple/doc-extract",
  },
  {
    slug: "voice-to-tasks",
    title: "Voice to Tasks",
    tagline: "Speak for 30 seconds, get a to-do list that quotes your words",
    description:
      "Whisper turns a voice note into a transcript, and a text model writes a summary and a to-do list. Every task must quote the words you said, and owners or deadlines you never mentioned are removed. Transcription accuracy is measured as word error rate on public LibriSpeech recordings. Groq-hosted models, cloud hosting.",
    tags: ["Speech AI", "Whisper", "LLM Extraction", "Evaluation", "Groq", "GitHub Actions"],
    year: "2026",
    featured: true,
    url: "/voice-to-tasks",
    category: "Speech & Voice AI",
    cta: "Talk to it",
    accent: "emerald",
    repo: "https://github.com/Mc-KellyTPepple/voice-to-tasks",
  },
  {
    slug: "edgar-analyst",
    title: "EDGAR Analyst",
    tagline: "An agent for SEC filings that shows its evidence",
    description:
      "A research agent over 10-K filings with calculator-checked numbers, filing citations and honest refusals, plus an automatic evaluation suite with held-out sets. Runs on Groq models and cloud hosting, with a frontend that hides cold starts.",
    tags: ["LLM Agents", "Evaluation", "Tool Use", "Hybrid Retrieval", "Groq", "GitHub Actions"],
    year: "2026",
    featured: true,
    url: "/edgar-analyst",
    category: "LLM Agents & Evaluation",
    cta: "Ask the agent",
    accent: "amber",
    repo: "https://github.com/Mc-KellyTPepple/edgar-analyst",
  },
  {
    slug: "data-analyst-agent",
    title: "Data Analyst Agent",
    tagline: "Ask your data in plain English, measured on Spider",
    description:
      "A text-to-SQL agent that runs model-written queries read-only, reads results and errors, and asks when a question is ambiguous. Upload a CSV or use the demo shop. Scored on the public Spider benchmark with an ablation and an honest failure analysis, on Groq-hosted models and cloud hosting.",
    tags: ["LLM Agents", "Text-to-SQL", "Evaluation", "SQLite", "Groq", "GitHub Actions"],
    year: "2026",
    featured: true,
    url: "/data-analyst",
    category: "LLM Agents & Data",
    cta: "Ask your data",
    accent: "emerald",
    repo: "https://github.com/Mc-KellyTPepple/data-analyst-agent",
  },
  {
    slug: "ask-your-files",
    title: "Ask Your Files (RAG)",
    tagline: "Document Q&A with sources you can check",
    description:
      "Upload PDFs, Office files, spreadsheets, web pages or images and ask questions. Hybrid vector and keyword search with reranking, OCR for scans, and numbered citations, running on cloud hosting with a frontend that hides cold starts.",
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
];
