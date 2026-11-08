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
 * Spider development set, two different 100-question samples (seeds 1 and 2), prompt v2, each model on its own results.
 * Each cell: sample 1 / sample 2, then the pooled score over all 200. Token figures are measured means per question.
 */
export const ANALYST_RESULTS: AnalystRow[] = [
  { label: "One shot, no tools", large: "82% / 77% (79.5% of 200)", small: "86% / 77% (81.5% of 200)", tokens: "about 560" },
  { label: "Lean: one query, one retry on error (the live demo)", large: "81% / 79% (80.0% of 200)", small: "88% / 81% (84.5% of 200)", tokens: "about 960" },
  { label: "Agent, self-correcting (up to 5 tries)", large: "81% / 78% (79.5% of 200)", small: "86% / 80% (83.0% of 200)", tokens: "about 2,300" },
  { label: "Five candidates, majority result", large: "82% / 75% (78.5% of 200)", small: "88% / 78% (83.0% of 200)", tokens: "about 2,800" },
];

/** Ablations on sample 1 only (100 questions): what the agent's extras are worth. */
export const ANALYST_ABLATIONS: AnalystRow[] = [
  { label: "Agent, one try only (no retry)", large: "82% (82/100)", small: "84% (84/100)", tokens: "about 2,300" },
  { label: "Agent, no sample rows in the prompt", large: "83% (83/100)", small: "87% (87/100)", tokens: "about 1,600" },
];

/** Accuracy when the five candidate queries agree on the result, versus when they split. */
export const ANALYST_AGREEMENT = [
  { label: "All five agree", large: "90.6% (77 of 85 questions)", small: "94.4% (68 of 72 questions)" },
  { label: "Candidates disagree", large: "33.3% (5 of 15 questions)", small: "71.4% (20 of 28 questions)" },
];
