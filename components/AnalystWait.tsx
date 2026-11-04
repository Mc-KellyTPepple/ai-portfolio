"use client";

import { useEffect, useState } from "react";

type Props = { mode: "wake" | "ask" };

const TOTAL_SECONDS = 75;
const WAKE_STEPS = [
  "Waking the free server",
  "Opening the demo database",
  "Connecting to the model",
  "Getting the agent ready",
];
const ASK_STEPS = [
  "Reading the schema",
  "Writing a query",
  "Running it read-only",
  "Checking the result",
  "Fixing and retrying if needed",
  "Writing the answer",
];
const STORIES = [
  {
    title: "Why the wait?",
    text: "This runs on a free server that sleeps when nobody is using it. Starting it takes up to a minute, and you are the one who woke it up.",
  },
  {
    title: "The model never touches your data",
    text: "Every query runs on a read-only connection. Writes, PRAGMA, ATTACH and multiple statements are rejected before they run.",
  },
  {
    title: "One retry, only when needed",
    text: "If a query fails or returns nothing, the agent sees why and tries once more. Otherwise it answers after a single model call.",
  },
  {
    title: "Measured on Spider",
    text: "Accuracy is scored on the public Spider benchmark by comparing the rows each query returns, with an ablation showing what self-correction adds.",
  },
  {
    title: "Ambiguous? It asks",
    text: "If a question could mean two different things, the agent asks you a short question instead of guessing.",
  },
  {
    title: "Bring your own data",
    text: "Upload a CSV up to 400 KB. It is held in memory for an hour and never written to disk.",
  },
];

export default function AnalystWait({ mode }: Props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const steps = mode === "wake" ? WAKE_STEPS : ASK_STEPS;
  const stepLength = (mode === "wake" ? 60 : 30) / steps.length;
  const active = Math.min(steps.length - 1, Math.floor(seconds / stepLength));
  const story = STORIES[Math.floor(seconds / 7) % STORIES.length];
  const percent = Math.min(95, Math.round((seconds / TOTAL_SECONDS) * 100));

  return (
    <div className="toolkitCard eaWait" role="status" aria-live="off">
      <p className="eyebrow">{mode === "wake" ? "Starting up" : "Working on it"}</p>
      <ol className="eaSteps">
        {steps.map((label, i) => (
          <li key={label} data-state={i < active ? "done" : i === active ? "active" : "todo"}>
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
