/** Single place to configure the Model Lab page (/model-lab). */

/** Live API on Render. It sleeps when idle; opening the page wakes it. */
export const MODEL_LAB_API_URL = "https://model-lab-u625.onrender.com";

export const MODEL_LAB_REPO_URL = "https://github.com/Mc-KellyTPepple/model-lab";

export type LabSample = { id: string; title: string; kind: "real" | "synthetic"; target: string; blurb: string };

/** Mirrors the server's /samples list so the page can render before the server has woken up. */
export const MODEL_LAB_SAMPLES: LabSample[] = [
  { id: "churn", title: "Customer churn", kind: "synthetic", target: "churned", blurb: "1,500 invented subscribers. Who cancels depends on tenure, contract and support calls." },
  { id: "churn_leaky", title: "Churn with a leak", kind: "synthetic", target: "churned", blurb: "The same data plus an account_status column that gives the answer away. Watch it get caught." },
  { id: "wine", title: "Wine cultivar", kind: "real", target: "cultivar", blurb: "178 wines, 13 lab measurements, 3 grape cultivars (UCI Wine)." },
  { id: "breast_cancer", title: "Tumour type", kind: "real", target: "diagnosis", blurb: "569 cell-nucleus measurements, benign or malignant (UCI Wisconsin Diagnostic)." },
  { id: "diabetes", title: "Diabetes progression", kind: "real", target: "progression", blurb: "442 patients, 10 baseline measures, disease progression a year later (Efron et al.)." },
];

/** Used by the Monitor tab: newer data to compare against a model trained on "churn". */
export const MODEL_LAB_DRIFT_SAMPLE = { id: "churn_later", label: "Use “churn, a year later” (synthetic)" };

export const STAGE_LABELS: Record<string, string> = {
  queued: "Waiting for a turn",
  read: "Reading your file",
  split: "Setting aside the test rows",
  leaks: "Looking for answer-giveaway columns",
  models: "Comparing models",
  choose: "Choosing a model",
  test: "Scoring the test rows once",
  explain: "Working out which columns mattered",
  contrast: "Measuring how misleading a leak would be",
  serve: "Preparing the prediction form",
  done: "Done",
};
