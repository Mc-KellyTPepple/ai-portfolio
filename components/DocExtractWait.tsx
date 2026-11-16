"use client";

import { useEffect, useState } from "react";

type Props = { mode: "wake" | "extract" };

const TOTAL_SECONDS = 75;
const WAKE_STEPS = ["Waking the free server", "Starting the extractor", "Connecting to the vision model", "Getting ready"];
const EXTRACT_STEPS = ["Preparing the image", "Reading the receipt", "Writing the fields", "Checking the arithmetic", "Re-reading if something is off"];
const STORIES = [
  {
    title: "Why the wait?",
    text: "This runs on a free server that sleeps when nobody is using it. Starting it takes up to a minute, and you are the one who woke it up.",
  },
  {
    title: "It checks its own sums",
    text: "Line prices should add up to the subtotal, and subtotal plus tax and service minus any discount should equal the total. When they do not, the model is shown which check failed and looks again.",
  },
  {
    title: "It flags instead of guessing",
    text: "If the numbers still do not add up after a second look, the receipt is marked for review rather than trusted. It never invents a number to make the sums work.",
  },
  {
    title: "Measured, not just demoed",
    text: "Accuracy is scored on the public CORD receipt set against OCR baselines, and the failures are listed on this page.",
  },
  {
    title: "Your image stays private",
    text: "Images are processed in memory and never stored or logged. Photos are shrunk in your browser before they are sent.",
  },
];

export default function DocExtractWait({ mode }: Props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const steps = mode === "wake" ? WAKE_STEPS : EXTRACT_STEPS;
  const stepLength = (mode === "wake" ? 60 : 20) / steps.length;
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
