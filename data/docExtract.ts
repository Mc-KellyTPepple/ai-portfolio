/** Single place to configure the Doc Extract page (/doc-extract). */

/** Live API on Render's free plan. It sleeps when idle; opening the page wakes it. */
export const DOCX_API_URL = "https://doc-extract-mvhp.onrender.com";

export const DOCX_REPO_URL = "https://github.com/Mc-KellyTPepple/doc-extract";

/** Receipts drawn for this demo (not real documents). The third is misprinted on purpose so the review flag can be seen. */
export const DOCX_SAMPLES = [
  { id: "cafe", label: "Café receipt", file: "/doc-extract/sample-cafe.jpg", note: "Adds up" },
  { id: "market", label: "Market receipt with a discount", file: "/doc-extract/sample-market.jpg", note: "Adds up" },
  { id: "misprint", label: "Invoice with a wrong total", file: "/doc-extract/sample-misprint.jpg", note: "Misprinted on purpose" },
];

/** Longest side, in pixels, that photos are shrunk to in the browser before upload. */
export const DOCX_MAX_SIDE = 1600;

/**
 * Benchmark numbers. NOT PUBLISHED YET: the first run used a prompt that made the model write printed amounts like
 * "60.000" as the number 60.0, so its numbers measured the prompt, not the model. The fix is deployed and the benchmark
 * is re-running under Groq's free daily quota (about 45 vision receipts a day). When the run finishes, copy the table from
 * results/results.md in the repo into DOCX_RESULTS, then set DOCX_RESULTS_FINAL to true.
 */
export const DOCX_RESULTS_FINAL = false;
export const DOCX_RESULTS_DOCS = 0;
export const DOCX_RESULTS: { name: string; note: string; total: string; allFields: string; items: string }[] = [];
