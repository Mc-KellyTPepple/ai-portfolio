"use client";

import { useEffect, useState } from "react";

type Props = {
  /** "wake": the free server is starting up. "ask": the agent is working on a question. */
  mode: "wake" | "ask";
};

const TOTAL_SECONDS = 75;

const WAKE_STEPS = [
  "Waking the free server",
  "Loading the filings database",
  "Loading the search index",
  "Getting the agent ready",
];

const ASK_STEPS = [
  "Reading your question",
  "Looking up structured facts",
  "Computing ratios with the calculator tool",
  "Searching the filing text",
  "Checking every figure against its source",
  "Writing a cited answer",
];

const STORIES = [
  {
    title: "Why the wait?",
    text: "This runs on a free server that sleeps when nobody is using it. Starting it takes up to a minute, and you are the one who woke it up.",
  },
  {
    title: "What is a 10-K?",
    text: "The annual report every US public company files with the SEC. It holds audited financial statements and plain-language sections on the business and its risks.",
  },
  {
    title: "No mental maths",
    text: "Language models make arithmetic slips. This agent calls a calculator tool for every ratio and growth rate, and only reports what the tool returned.",
  },
  {
    title: "It is allowed to say no",
    text: "Ask about 2031 or a company outside the ten and it refuses instead of guessing. Refusals are scored in the evaluation too.",
  },
  {
    title: "Graded automatically",
    text: "187 questions are scored by code against values computed from the filings. Scroll down for the results and the limits of those numbers.",
  },
  {
    title: "Two kinds of evidence",
    text: "Numbers come from structured filing data. Facts that only appear in prose, like employee counts, come from searching the filing text.",
  },
  {
    title: "Free on every layer",
    text: "Free Groq models with automatic fallback, free Render hosting and free GitHub Actions for the nightly evaluation.",
  },
  {
    title: "Try a comparison",
    text: "Ask it to compare two companies, for example Microsoft and Alphabet operating margins, and watch it use several tools in sequence.",
  },
];

export default function EdgarWait({ mode }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const steps = mode === "wake" ? WAKE_STEPS : ASK_STEPS;
  const stepLength = (mode === "wake" ? 60 : 45) / steps.length;
  const active = Math.min(steps.length - 1, Math.floor(seconds / stepLength));
  const story = STORIES[Math.floor(seconds / 7) % STORIES.length];
  const percent = Math.min(95, Math.round((seconds / TOTAL_SECONDS) * 100));

  return (
    <div className="toolkitCard eaWait" role="status" aria-live="off">
      <p className="eyebrow">{mode === "wake" ? "Starting up" : "Working on it"}</p>

      <ol className="eaSteps">
        {steps.map((label, i) => (
          <li
            key={label}
            data-state={i < active ? "done" : i === active ? "active" : "todo"}
          >
            <span className="eaStepMark" aria-hidden="true">
              {i < active ? "✓" : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="eaBar" aria-hidden="true">
        <div className="eaBarFill" style={{ width: `${percent}%` }} />
      </div>

      <div className="eaStory" key={story.title}>
        <p className="eaStoryTitle">{story.title}</p>
        <p className="eaStoryText">{story.text}</p>
      </div>
    </div>
  );
}
