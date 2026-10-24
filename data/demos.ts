/** Content for the three demo pages. Edit the text here; the layout lives in components/DemoPage.tsx. */

export type Demo = {
  metaTitle: string;
  metaDescription: string;
  path: string;
  eyebrow: string;
  lead: string;
  accent: string;
  intro: string;
  stack: string[];
  repo: string;
  facts: { label: string; value: string }[];
  /** Id in app/api/ping/route.ts */
  probe: string;
  statusLabel: string;
  appUrl: string;
  /** true: show the app inside the page once awake. false: link out to it. */
  embed: boolean;
  tryHeading: string;
  tryText: string;
  openLabel: string;
  frameTitle: string;
  extra?: { subject: string; label: string };
  pointsEyebrow: string;
  pointsHeading: string;
  pointsText: string;
  points: { title: string; text: string }[];
};

export const plantDisease: Demo = {
  metaTitle: "Plant Disease Detection AI | Mc-Kelly Pepple",
  metaDescription:
    "A MobileNetV3-Large classifier that identifies plant diseases from leaf photos, served with ONNX Runtime. Upload a leaf and try it.",
  path: "/plant-disease",
  eyebrow: "Computer Vision \u00b7 Deployed \u00b7 2024",
  lead: "Spot plant disease from",
  accent: "a single leaf photo",
  intro:
    "A deep learning classifier built on MobileNetV3-Large that identifies plant diseases from leaf images. It runs on the CPU through ONNX Runtime, so it stays light enough for a small server.",
  stack: ["Computer Vision", "MobileNetV3", "ONNX Runtime", "Python", "Gradio", "Render"],
  repo: "https://github.com/Mc-KellyTPepple/plant-disease-diagnosis",
  facts: [
    { label: "Model", value: "MobileNetV3-Large" },
    { label: "Runtime", value: "ONNX Runtime on CPU" },
    { label: "Interface", value: "Gradio" },
    { label: "Hosting", value: "Render free plan" },
  ],
  probe: "plant",
  statusLabel: "Plant model \u00b7 Render",
  appUrl: "https://plant-disease-diagnosis-alvy.onrender.com/",
  embed: true,
  tryHeading: "Upload a leaf and see the prediction",
  tryText:
    "The model runs on a free server that sleeps when idle. This page wakes it as soon as you arrive, and the demo appears below when it is ready.",
  openLabel: "Open in a new tab",
  frameTitle: "Plant disease detection demo",
  pointsEyebrow: "Getting good results",
  pointsHeading: "Tips for a useful prediction",
  pointsText: "The output is a model's best guess from a photo, so a clear image matters.",
  points: [
    { title: "One leaf, in focus", text: "Fill the frame with a single leaf and keep the camera steady." },
    {
      title: "Even, natural light",
      text: "Avoid harsh shadows and flash glare, which can look like spots to a model.",
    },
    {
      title: "A lead, not a verdict",
      text: "A prediction is a starting point. For treatment decisions, confirm with an agronomist or your local extension service.",
    },
  ],
};

export const animalClassifier: Demo = {
  metaTitle: "Animal Image Classifier | Mc-Kelly Pepple",
  metaDescription:
    "A deployed image classifier for cats, dogs and birds, covering preprocessing, training and real-time inference. Upload a photo and try it.",
  path: "/animal-classifier",
  eyebrow: "Computer Vision \u00b7 Deployed \u00b7 2024",
  lead: "Is it a cat, a dog",
  accent: "or a bird?",
  intro:
    "A production-ready image classification pipeline covering data preprocessing, model training and deployment, serving real-time predictions for cats, dogs and birds.",
  stack: ["Computer Vision", "Classification", "ONNX Runtime", "Python", "Render"],
  repo: "https://github.com/Mc-KellyTPepple/my-first-ai-image-classifier",
  facts: [
    { label: "Classes", value: "Cat, dog, bird" },
    { label: "Runtime", value: "ONNX Runtime on CPU" },
    { label: "Pipeline", value: "Preprocessing, training, deployment" },
    { label: "Hosting", value: "Render free plan" },
  ],
  probe: "animal",
  statusLabel: "Animal model \u00b7 Render",
  appUrl: "https://my-first-ai-image-classifier.onrender.com/",
  embed: true,
  tryHeading: "Upload a photo and get a prediction",
  tryText:
    "The model runs on a free server that sleeps when idle. This page wakes it as soon as you arrive, and the demo appears below when it is ready.",
  openLabel: "Open in a new tab",
  frameTitle: "Animal image classifier demo",
  pointsEyebrow: "Getting good results",
  pointsHeading: "What to expect",
  pointsText: "A small, focused model. It is good at its three classes and honest about little else.",
  points: [
    { title: "A clear subject", text: "Keep the animal large in the frame, with little clutter behind it." },
    {
      title: "Only three classes",
      text: "It knows cats, dogs and birds. Other animals will usually still get one of those three labels, so try a few to see where it breaks.",
    },
    {
      title: "Shipped, not just trained",
      text: "It was my first end-to-end classifier, built to practise putting a model into production, not only training one.",
    },
  ],
};

export const askYourFiles: Demo = {
  metaTitle: "Ask Your Files (RAG) | Mc-Kelly Pepple",
  metaDescription:
    "Upload documents and ask questions. Hybrid search, reranking and OCR, with numbered citations to the passages each answer came from.",
  path: "/ask-your-files",
  eyebrow: "Retrieval \u00b7 Full-Stack \u00b7 2026",
  lead: "Ask questions of your documents,",
  accent: "with sources you can check",
  intro:
    "Upload PDFs, Word, PowerPoint, Excel, CSV, web pages, text or images, then ask questions. Every answer cites the passages it came from, so you can verify it.",
  stack: ["FastAPI", "pgvector", "Supabase", "Hybrid search", "Reranking", "OCR", "Groq", "Vercel", "Render"],
  repo: "https://github.com/Mc-KellyTPepple/rag-platform",
  facts: [
    { label: "Search", value: "Vector plus keyword, then reranked" },
    { label: "Files", value: "PDF (scans via OCR), Office, CSV, web pages, text, images" },
    { label: "Backend", value: "FastAPI on Render" },
    { label: "Data", value: "Supabase Postgres with pgvector" },
  ],
  probe: "rag",
  statusLabel: "Search backend \u00b7 Render",
  appUrl: "https://rag-frontend-swart-nu.vercel.app/",
  embed: false,
  tryHeading: "Private workspaces, by access code",
  tryText:
    "Documents stay private to each access code, so the app asks for one. Request a code and I will send you one. The backend sleeps when idle on the free plan; this page wakes it while you read.",
  openLabel: "Open the app",
  frameTitle: "Ask your files",
  extra: { subject: "Ask your files access code", label: "Request an access code" },
  pointsEyebrow: "Under the hood",
  pointsHeading: "What makes the answers checkable",
  pointsText: "The interesting parts are retrieval quality and running it all on free hosting.",
  points: [
    {
      title: "Hybrid retrieval",
      text: "Each question runs a vector search and a keyword search together and merges them. A reranker then picks the best passages.",
    },
    {
      title: "Cited answers",
      text: "Answers carry numbered citations. Click one to see the highlighted passage it came from.",
    },
    {
      title: "Built for a small server",
      text: "The reranker and OCR load only when needed and unload when idle, and files are indexed in small batches so a 512 MB server stays stable.",
    },
    {
      title: "No cold-start surprise",
      text: "The frontend wakes the backend as soon as the page opens and keeps it awake while you use it.",
    },
  ],
};
