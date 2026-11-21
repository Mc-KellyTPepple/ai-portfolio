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
    "A leaf-photo classifier for 38 crop and disease classes that says when it is not sure, with accuracy measured on real field photos. Upload a leaf and try it.",
  path: "/plant-disease",
  eyebrow: "Computer Vision \u00b7 Deployed",
  lead: "Spot plant disease from",
  accent: "a single leaf photo",
  intro:
    "A ConvNeXt-Tiny classifier (the LeafScan model by Marconcini, CC BY-SA 4.0) that names the crop and disease from a leaf photo. It answers only when it is confident, shows candidates when it is not, and runs on the CPU through ONNX Runtime.",
  stack: ["Computer Vision", "ConvNeXt", "ONNX Runtime", "Calibrated confidence", "Python", "Gradio", "Render"],
  repo: "https://github.com/Mc-KellyTPepple/plant-disease-diagnosis",
  facts: [
    { label: "Model", value: "LeafScan ConvNeXt-T (int8)" },
    { label: "Field accuracy", value: "71.2% on 236 real photos" },
    { label: "When it answers", value: "85.1% right, on 65% of photos" },
    { label: "Runtime", value: "ONNX Runtime on CPU" },
  ],
  probe: "plant",
  statusLabel: "Plant model \u00b7 Render",
  appUrl: "https://plant-disease-diagnosis-alvy.onrender.com/",
  embed: true,
  tryHeading: "Upload a leaf and see the prediction",
  tryText:
    "The model server sleeps when idle. This page wakes it as soon as you arrive, and the demo appears below when it is ready.",
  openLabel: "Open in a new tab",
  frameTitle: "Plant disease detection demo",
  pointsEyebrow: "Getting good results",
  pointsHeading: "How to read the result",
  pointsText: "The output is a model's best guess from a photo, so a clear image matters, and so does knowing how it was measured.",
  points: [
    {
      title: "Measured on real field photos",
      text: "Scored on the 236 photos of the PlantDoc test split, which the model never saw in training: 71.2% right overall (95% interval 65.1 to 76.6), 87.3% right on the crop, and 95.3% right on healthy versus diseased. The app answers confidently on 65.3% of photos and is right 85.1% of the time when it does.",
    },
    {
      title: "When it hedges, the answer is usually on the list",
      text: "On the 68 test photos where the app says \"possible, not certain\", its first choice was right 48.5% of the time, but the true disease was among the three candidates shown 91.2% of the time. The confidence cutoff was checked by fitting it on random halves of the test photos and scoring the other half; re-fitting gave no reliable gain, so the model author's value stays.",
    },
    {
      title: "Lab accuracy is not field accuracy",
      text: "A model trained only on clean lab photos can score above 99% there and about 31% on field photos. That is why the numbers here come from field photos, and why the app says \"possible\" or \"I can't tell\" instead of guessing.",
    },
    { title: "One leaf, in focus", text: "Fill the frame with a single leaf and keep the camera steady." },
    {
      title: "Even, natural light",
      text: "Avoid harsh shadows and flash glare, which can look like spots to a model.",
    },
    {
      title: "A lead, not a verdict",
      text: "It knows only 38 crop and disease classes, can still give a diagnosis for a photo that is not a leaf, and has no view on pests or nutrient problems. For treatment decisions, confirm with an agronomist or your local extension service. Model: LeafScan by Marconcini, CC BY-SA 4.0, trained on PlantVillage and PlantDoc.",
    },
  ],
};

export const animalClassifier: Demo = {
  metaTitle: "Animal Image Classifier | Mc-Kelly Pepple",
  metaDescription:
    "A deployed image classifier for cats, dogs and birds, covering preprocessing, training and real-time inference. Upload a photo and try it.",
  path: "/animal-classifier",
  eyebrow: "Computer Vision \u00b7 Deployed",
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
    { label: "Hosting", value: "Render" },
  ],
  probe: "animal",
  statusLabel: "Animal model \u00b7 Render",
  appUrl: "https://my-first-ai-image-classifier.onrender.com/",
  embed: true,
  tryHeading: "Upload a photo and get a prediction",
  tryText:
    "The model server sleeps when idle. This page wakes it as soon as you arrive, and the demo appears below when it is ready.",
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
  eyebrow: "Retrieval \u00b7 Full-Stack",
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
    "Documents stay private to each access code, so the app asks for one. Request a code and I will send you one. The backend sleeps when idle; this page wakes it while you read.",
  openLabel: "Open the app",
  frameTitle: "Ask your files",
  extra: { subject: "Ask your files access code", label: "Request an access code" },
  pointsEyebrow: "Under the hood",
  pointsHeading: "What makes the answers checkable",
  pointsText: "The interesting parts are retrieval quality and running it all on lean cloud hosting.",
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
