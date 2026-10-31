/** Single place to configure the EDGAR Analyst page (/edgar-analyst). */

/** Live API on Render's free plan. The page pings /health on load so it is awake when you arrive. */
export const EDGAR_API_URL = "https://edgar-analyst.onrender.com";

export const EDGAR_REPO_URL = "https://github.com/Mc-KellyTPepple/edgar-analyst";

export const EDGAR_EXAMPLES = [
  "What was NVIDIA's net profit margin for the fiscal year ended January 28, 2024?",
  "How many employees did Apple have in its fiscal 2024 10-K?",
  "Compare Microsoft and Alphabet operating margins for their latest fiscal years.",
  "What was NVIDIA's revenue in 2031?",
];

export type EdgarResult = { label: string; facts: string; full: string };

/** Measured on the nightly evaluation suite (see the repository README for the full tables). */
export const EDGAR_RESULTS: EdgarResult[] = [
  { label: "Lookups, multi-step maths, comparisons (tiers 1-3)", facts: "100%", full: "100%" },
  { label: "Facts from filing text, e.g. employee counts (tier 4)", facts: "0% (by design)", full: "87.0% (20/23)" },
  { label: "Refuses unanswerable questions", facts: "100%", full: "100%" },
  { label: "Held-out set 1 (66 questions, unseen at tuning time)", facts: "93.9%", full: "100%" },
  { label: "Held-out set 2 (89 questions, run after the fixes)", facts: "100%", full: "100%" },
];
