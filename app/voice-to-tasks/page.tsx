import type { Metadata } from "next";
import Link from "next/link";
import VoiceDemo from "@/components/VoiceDemo";
import VoiceBoard from "@/components/VoiceBoard";
import ProjectBanner from "@/components/ProjectBanner";
import SocialLinks from "@/components/SocialLinks";
import { VOICE_REPO_URL } from "@/data/voiceToTasks";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Voice to Tasks | Mc-Kelly Pepple",
  description:
    "Speak for up to 30 seconds and get a transcript, a summary and a to-do list in which every task points at the words you said. Transcription accuracy is measured as word error rate on public LibriSpeech recordings.",
  alternates: { canonical: "/voice-to-tasks" },
  openGraph: {
    title: "Voice to Tasks | Mc-Kelly Pepple",
    description: "Speech to a checked to-do list, with measured word error rate.",
    type: "article",
    url: "/voice-to-tasks",
  },
};

const stack = ["Speech AI", "Whisper", "LLM extraction", "Grounding checks", "Evaluation", "Groq", "GitHub Actions", "Render", "Python"];

const facts = [
  { label: "Task", value: "Voice note to to-do list" },
  { label: "Safety net", value: "Every task quotes your words" },
  { label: "Evaluation", value: "Word error rate on LibriSpeech" },
  { label: "Hosting", value: "Render, wakes on visit" },
];

const design = [
  { title: "Every task shows its evidence", text: "The model must quote the exact words behind each task. If the quote is not in the transcript, the task is marked as not found in the transcript instead of being presented as fact." },
  { title: "No invented owners or deadlines", text: "A person or a date appears on a task only when you said it. Anything else the model adds is removed before you see the list." },
  { title: "Silence stays silent", text: "Speech models tend to produce text for silent audio. When every segment is probably not speech, the clip is reported as empty and no tasks are made." },
  { title: "Your voice stays yours", text: "Recordings are held in memory for the request only. Nothing is stored or logged, there is a size limit, and the file type is checked before any model is called." },
];

const method = [
  "A fixed random sample (seed 1) of LibriSpeech test-clean and test-other utterances up to 30 seconds long. LibriSpeech is public data released under CC BY 4.0.",
  "The original audio is sent to the same speech models the demo uses, and each transcript is compared with the reference text.",
  "Text is lowercased, digits are spelled out and punctuation is removed before scoring. Word error rate is total errors divided by total reference words, with a bootstrap 95% interval over utterances.",
  "The run is a GitHub Actions workflow in the repository. Every transcript is committed next to the summary, and this page reads the summary file.",
];

const limits = [
  "LibriSpeech is read audiobook speech. A rushed voice note on a phone, with background noise, accents and half-finished sentences, is harder, so treat the scores as a best case for this task.",
  "Word error rate measures the transcript, not the to-do list. The grounding check shows whether each task is supported by the transcript; it does not prove the list is complete.",
  "The sample is a few dozen recordings per configuration, so small differences between models are within the intervals shown.",
  "The demo is English. It limits each visitor and each day so the model quota is shared fairly.",
];

export default function VoiceToTasksPage() {
  return (
    <>
      <header className="siteHeader">
        <nav className="navInner" aria-label="Primary">
          <Link href="/" className="brand">
            <span className="brandMark" aria-hidden="true">
              MP
            </span>
            <span className="brandName">Mc-Kelly Pepple</span>
          </Link>
          <Link href="/#projects" className="navCta">
            &larr; All projects
          </Link>
        </nav>
      </header>

      <main id="top">
        <section className="htHero">
          <div className="htHeroText">
            <p className="eyebrow">Speech AI &middot; Voice</p>
            <h1>
              Voice to Tasks: say it once, <span className="gradientText">get a list you can check</span>
            </h1>
            <p className="htLead">
              Speak for up to 30 seconds. You get the transcript, a short summary and a to-do list, and every task shows the exact
              words you said that it came from.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a href={VOICE_REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btnGhost">
                View source
                <span className="srOnly"> (opens in a new tab)</span>
              </a>
            </div>
            <ul className="htStack" aria-label="Technologies">
              {stack.map((item) => (
                <li key={item} className="projectTag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <dl className="toolkitCard demoFacts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ProjectBanner kind="voice" />

        <section id="try" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Try it</p>
            <h2>Talk to it</h2>
            <p>
              Press record, say a few things you need to do, and stop. The server sleeps when idle; this page wakes it as soon as
              you arrive, and a short tour plays while it starts. No microphone? Paste a note instead.
            </p>
          </div>
          <VoiceDemo />
        </section>

        <section id="results" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Evaluation</p>
            <h2>How accurate is the transcription?</h2>
            <p>Word error rate on public recordings, for the two Whisper models the service can use, on clear and on harder speech.</p>
          </div>
          <VoiceBoard />
          <div className="toolkitCard" style={{ marginTop: "1rem" }}>
            <p className="eaLabel">Method</p>
            <ul className="eaLimits">
              {method.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Design</p>
            <h2>What makes it trustworthy</h2>
          </div>
          <div className="toolkitGrid demoPoints">
            {design.map((item) => (
              <div key={item.title} className="toolkitCard">
                <h3>{item.title}</h3>
                <p className="htCardText">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Limits</p>
            <h2>Where it does not apply</h2>
          </div>
          <div className="toolkitCard">
            <ul className="eaLimits">
              {limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="contactCard">
            <p className="eyebrow">More work</p>
            <h2>See the rest of the portfolio</h2>
            <p>Machine learning, computer vision and deployable AI systems, taken from experiment to something you can open and try.</p>
            <div className="htTryActions">
              <Link href="/#projects" className="btn btnPrimary">
                All projects
              </Link>
              <a href={`mailto:${EMAIL}`} className="btn btnGhost">
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="siteFooter">
        <div className="footerInner">
          <p>&copy; 2026 Mc-Kelly Pepple. All rights reserved.</p>
          <SocialLinks className="footerSocial" />
          <a href="#top">Back to top &uarr;</a>
        </div>
      </footer>
    </>
  );
}
