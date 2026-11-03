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
 * The small model's "paired" column compares only the 86 questions all three configurations have finished; update it when the rest land.
 */
export const ANALYST_RESULTS: AnalystRow[] = [
  { label: "One shot, no tools", large: "82.0% (82/100)", small: "86.0% (74/86)", tokens: "about 550" },
  { label: "Agent, self-correcting", large: "81.0% (81/100)", small: "86.0% (74/86)", tokens: "about 2,300" },
  { label: "Five candidates, majority result", large: "82.0% (82/100)", small: "88.4% (76/86)", tokens: "about 2,800" },
];

/** Accuracy when the five candidate queries agree on the result, versus when they split. */
export const ANALYST_AGREEMENT = [
  { label: "All five agree", large: "90.6% (85 questions)", small: "96.6% (59 questions)" },
  { label: "Candidates disagree", large: "33.3% (15 questions)", small: "70.4% (27 questions)" },
];
