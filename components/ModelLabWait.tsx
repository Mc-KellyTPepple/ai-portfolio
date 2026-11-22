"use client";

import { useEffect, useState } from "react";

const STEPS = ["Waking the server", "Loading the modelling libraries", "Warming up the training queue", "Getting ready"];
const STORIES = [
  { title: "Why the wait?", text: "This server sleeps when nobody is using it. Starting it takes up to a minute, and you are the one who woke it up." },
  { title: "20% of your rows are locked away", text: "Before any model is tried, a fifth of the rows are set aside. They are scored once, at the end, so the final number is not flattered by tuning." },
  { title: "Every model has to beat a baseline", text: "The baseline always guesses the most common answer. If a fancy model cannot clearly beat that, the page says so." },
  { title: "Some columns give the answer away", text: "A column recorded after the outcome (like an account status when predicting churn) makes any model look perfect. Model Lab looks for these and leaves them out." },
  { title: "Simple wins ties", text: "If a simpler model is within one standard error of the best, it is chosen. It is easier to explain and less likely to be memorising noise." },
  { title: "Your file stays in memory", text: "Uploads are never written to disk or logged, and the trained model is forgotten after an hour." },
];

export default function ModelLabWait() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);
  const active = Math.min(STEPS.length - 1, Math.floor(seconds / 15));
  const story = STORIES[Math.floor(seconds / 7) % STORIES.length];
  const percent = Math.min(95, Math.round((seconds / 75) * 100));
  return (
    <div className="toolkitCard eaWait" role="status" aria-live="off">
      <p className="eyebrow">Starting up</p>
      <ol className="eaSteps">
        {STEPS.map((label, i) => (
          <li key={label} data-state={i < active ? "done" : i === active ? "active" : "todo"}>
            <span className="eaStepMark" aria-hidden="true">{i < active ? "✓" : i + 1}</span>
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
