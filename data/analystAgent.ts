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

export type AnalystRow = { label: string; n: string; accuracy: string; note: string };

/** First benchmark run (prompt v1, partly mixed models). Replace with the pinned-model v2 table when it finishes. */
export const ANALYST_RESULTS_V1: AnalystRow[] = [
  { label: "One shot, no tools", n: "200", accuracy: "82.5%", note: "smaller 20B model" },
  { label: "Agent, one query allowed", n: "111 of 200", accuracy: "78.4%", note: "mostly 120B" },
  { label: "Agent, self-correcting", n: "154 of 200", accuracy: "79.2%", note: "mostly 120B" },
];
