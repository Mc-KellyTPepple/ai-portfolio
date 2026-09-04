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
  url: "https://talentmatch-ai-1-gcn6.onrender.com/",
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