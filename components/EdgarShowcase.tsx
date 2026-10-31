"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Seconds since the visitor arrived. */
  elapsed: number;
  /** True once the server has answered its health check. */
  ready: boolean;
};

const STAGES = [
  { at: 0, title: "Waking the server", text: "Free hosting puts idle services to sleep. Your visit is the wake-up call." },
  { at: 15, title: "Starting the Python service", text: "The standard-library web server boots and opens its port." },
  { at: 30, title: "Opening the filings database", text: "Structured facts and filing text are read from two SQLite files." },
  { at: 45, title: "Warming the search index", text: "Keyword search and a small embedding model get ready for filing-text questions." },
  { at: 60, title: "Almost there", text: "A cold start on the free plan can run a little past a minute." },
];

const SAMPLES = [
  {
    label: "A calculated ratio",
    question: "What was NVIDIA's net profit margin for the fiscal year ended January 28, 2024?",
    steps: [
      "Picks the financial_ratio tool instead of doing the maths itself",
      "Looks up net income and revenue for the fiscal year ending 2024-01-28",
      "The calculator tool divides them, so the arithmetic is exact",
    ],
    answer: "48.85%",
    note: "Cited filing 0001045810-26-000021",
  },
  {
    label: "Facts from filing text",
    question: "How many employees did Apple have in its fiscal 2024 10-K?",
    steps: [
      "Employee counts are prose, not structured data, so it uses search_filings",
      "Keyword and embedding search are fused to find the Item 1 passage",
      "Quotes the number exactly as written, with no rounding",
    ],
    answer: "About 164,000 full-time equivalent employees",
    note: "Cited filing 0000320193-24-000123",
  },
  {
    label: "An honest refusal",
    question: "What was NVIDIA's revenue in 2031?",
    steps: [
      "Checks which fiscal years the filings actually cover",
      "Finds nothing for 2031 and does not guess",
      "Refuses, and says why",
    ],
    answer: "Declined: there is no filing data for 2031.",
    note: "Refusals are scored in the evaluation too",
  },
];

export default function EdgarShowcase({ elapsed, ready }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  // While the server wakes, rotate through the sample runs until the visitor picks one.
  useEffect(() => {
    if (ready || picked !== null) return;
    const t = setInterval(() => setAuto((n) => (n + 1) % SAMPLES.length), 8000);
    return () => clearInterval(t);
  }, [ready, picked]);

  const index = picked ?? auto;
  const sample = SAMPLES[index];
  const stage = [...STAGES].reverse().find((s) => elapsed >= s.at) ?? STAGES[0];
  const progress = Math.min(100, Math.round((elapsed / 60) * 100));

  return (
    <div className="eaShowcase">
      {!ready && (
        <div className="toolkitCard eaWake" aria-live="off">
          <div className="eaWakeTop">
            <p className="eyebrow">While the server wakes up</p>
            <span className="eaWakeTime">{elapsed}s</span>
          </div>
          <div
            className="eaBar"
            role="progressbar"
            aria-label="Typical cold start, about one minute"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <ol className="eaStages">
            {STAGES.map((s) => {
              const state = s === stage ? "now" : s.at < stage.at ? "done" : "next";
              return (
                <li key={s.title} data-state={state}>
                  <span className="eaDot" aria-hidden="true" />
                  <span>
                    <strong>{s.title}</strong>
                    {state === "now" && <em>{s.text}</em>}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="eaNote">Typical steps and timing for a free-plan cold start, not a live log.</p>
        </div>
      )}

      <div className="toolkitCard eaSample">
        <p className="eyebrow">{ready ? "Sample runs" : "Read a real run in the meantime"}</p>
        <div className="eaTabs" role="tablist" aria-label="Sample questions">
          {SAMPLES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              className="eaTab"
              onClick={() => setPicked(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div role="tabpanel">
          <p className="eaQ">&ldquo;{sample.question}&rdquo;</p>
          <ol className="eaSteps">
            {sample.steps.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
          <p className="eaFinal">{sample.answer}</p>
          <p className="eaMeta">{sample.note}</p>
        </div>
      </div>
    </div>
  );
}
