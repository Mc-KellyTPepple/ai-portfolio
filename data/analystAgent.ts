/** Single place to configure the Data Analyst Agent page (/data-analyst). */

/** Live API on Render's free plan. It sleeps when idle; opening the page wakes it. */
export const ANALYST_API_URL = "https://data-analyst-agent-mti6.onrender.com";

export const ANALYST_REPO_URL = "https://github.com/Mc-KellyTPepple/data-analyst-agent";

export const DEMO_EXAMPLES = [
  "Which country has the most customers?",
  "What are the top 5 products by revenue?",
  "How many delivered orders were placed each month?",
  "Which product category has the highest share of returned orders?",
];

export const MAX_CSV_BYTES = 400_000;

export type AnalystRow = { label: string; large: string; small: string; tokens: string };

/**
 * Spider development-set sample (100 questions, seed 1), prompt v2, each model on its own results.
 * Every cell covers all 100 questions. Token figures are measured means per question.
 */
export const ANALYST_RESULTS: AnalystRow[] = [
  { label: "One shot, no tools", large: "82.0% (82/100)", small: "86.0% (86/100)", tokens: "about 560" },
  { label: "Lean: one query, one retry on error (the live demo)", large: "81.0% (81/100)", small: "88.0% (88/100)", tokens: "about 960" },
  { label: "Agent, self-correcting (up to 5 tries)", large: "81.0% (81/100)", small: "86.0% (86/100)", tokens: "about 2,300" },
  { label: "Five candidates, majority result", large: "82.0% (82/100)", small: "88.0% (88/100)", tokens: "about 2,800" },
];

/** Second, different 100-question sample (seed 2), larger model only, for the configurations that have finished. */
export const ANALYST_SEED2 = [
  { label: "One shot, no tools", large: "77.0% (77/100)" },
  { label: "Lean", large: "79.0% (79/100)" },
];

/** Accuracy when the five candidate queries agree on the result, versus when they split. */
export const ANALYST_AGREEMENT = [
  { label: "All five agree", large: "90.6% (77 of 85 questions)", small: "94.4% (68 of 72 questions)" },
  { label: "Candidates disagree", large: "33.3% (5 of 15 questions)", small: "71.4% (20 of 28 questions)" },
];
