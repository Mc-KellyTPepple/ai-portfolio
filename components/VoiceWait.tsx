"use client";

import { useEffect, useState } from "react";

const STEPS = ["Waking the server", "Starting the speech pipeline", "Connecting to the speech model", "Getting ready"];
const STORIES = [
  { title: "Why the wait?", text: "This server sleeps when nobody is using it. Starting it takes up to a minute, and you are the one who woke it up." },
  { title: "Every task points at your words", text: "The model has to quote what you said for each task. If the quote is not in the transcript, the task is marked as not grounded." },
  { title: "It will not invent an owner or a date", text: "If you never named a person or a deadline, the list leaves them blank instead of guessing." },
  { title: "Silence is not speech", text: "Speech models tend to make up text for silent audio. Clips with no speech are reported as empty." },
  { title: "Measured, not just demoed", text: "Transcription accuracy is scored as word error rate on public LibriSpeech recordings, and the numbers are on this page." },
  { title: "Your voice stays private", text: "Audio is processed in memory and never stored or logged." },
];

export default function VoiceWait() {
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
