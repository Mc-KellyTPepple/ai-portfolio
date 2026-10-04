export type Project = { 
  slug: string; 
  title: string; 
  tagline: string; 
  description: string; 
  tags: string[]; 
  year: string; 
  featured: boolean; 
  url: string; 
}; 
 
export const projects: Project[] = [ 
  { 
    slug: "talent-match-ai", 
    title: "Talent Match AI", 
    tagline: "AI powered talent matching from your CV", 
    description: 
      "A recommendation system that matches candidates to roles using embedding based similarity and structured scoring, built as an end to end deployable product.", 
    tags: ["Machine Learning", "Recommendation Systems", "Product"], 
    year: "2025", 
    featured: true, 
    url: "https://talentmatch-ai-frontend.vercel.app/",
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker Mobile App",
    tagline: "React Native & Supabase Full-Stack Habit Tracker",
    description:
      "A production-ready React Native mobile application built with Expo Go and Supabase backend services, featuring user authentication, habit tracking, and live API deployment on Render.",
    tags: ["React Native", "Expo", "Supabase", "Node.js", "Render"],
    year: "2026",
    featured: true,
    url: "https://habit-tracker-server-n1ax.onrender.com",
  },
  {
    slug: "lightface-ai",
    title: "LightFace AI",
    tagline: "Lightweight Hybrid Face Verification Engine",
    description:
      "A fast, privacy-conscious facial verification system powered by MobileFaceNet and ONNX Runtime CPU inference.",
    tags: ["MobileFaceNet", "ONNX Runtime", "Computer Vision", "Python", "Next.js"],
    year: "2026",
    featured: true,
    url: "https://lightface-hybrid-ai.vercel.app/",
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
  },
  {
    slug: "plant-disease-detection",
    title: "Plant Disease Detection AI",
    tagline: "Computer vision for plant disease",
    description:
      "A CNN based classifier that identifies plant diseases from leaf images, deployed as a lightweight application for real world agricultural use.",
    tags: ["Computer Vision", "CNN", "Deployment"],
    year: "2024",
    featured: true,
    url: "https://plant-disease-diagnosis-alvy.onrender.com/",
  },
];
