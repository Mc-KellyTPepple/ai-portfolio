import type { Metadata } from "next";
import Link from "next/link";
import AnalystDemo from "@/components/AnalystDemo";
import SocialLinks from "@/components/SocialLinks";
import { ANALYST_AGREEMENT, ANALYST_REPO_URL, ANALYST_RESULTS } from "@/data/analystAgent";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Data Analyst Agent | Mc-Kelly Pepple",
  description:
    "Ask questions of a database or a CSV in plain English. A read-only SQL agent that fixes its own errors, measured on the Spider benchmark with the failures reported. Free models, free hosting.",
  alternates: { canonical: "/data-analyst" },
  openGraph: {
    title: "Data Analyst Agent | Mc-Kelly Pepple",
    description: "Text-to-SQL agent with a read-only guard, measured on Spider, with an honest failure analysis.",
    type: "article",
    url: "/data-analyst",
  },
};

const stack = ["LLM agents", "Text-to-SQL", "SQLite", "Evaluation", "Spider benchmark", "Groq", "GitHub Actions", "Render", "Python"];

const facts = [
  { label: "Task", value: "Plain-English questions over SQL data" },
  { label: "Safety", value: "Read-only, one statement, time-limited" },
  { label: "Evaluation", value: "Spider development set, execution accuracy" },
  { label: "Hosting", value: "Render free plan, wakes on visit" },
];

const design = [
  {
    title: "Untrusted SQL, contained",
    text: "The model's SQL runs on a read-only connection behind a SQLite authorizer. Writes, PRAGMA, ATTACH and multiple statements are rejected, rows are capped and a 5 second limit stops runaway queries. Tests try each attack.",
  },
  {
    title: "Self-correction, tested honestly",
    text: "The agent reads errors and results and can retry up to five times. The benchmark measured whether that actually helps, and the answer, on Spider, is that it matches a plain baseline.",
  },
  {
    title: "Asks when it is unsure",
    text: "If a question is ambiguous in a way that changes the result, the web app asks a short clarifying question instead of guessing.",
  },
  {
    title: "Your data, briefly",
    text: "Upload a CSV up to 400 KB. It is loaded into memory for an hour and never written to disk.",
  },
];

const findings = [
  "On a 100-question sample, the one-shot baseline, the tool-using agent and majority voting all land within a couple of questions of each other, on both models. Tools and retries did not raise Spider accuracy; they cost about four times the tokens.",
  "The reason is where the errors are: the agent hits about 0.01 SQL errors per question, so retry-on-error rarely fires. Wrong answers are mostly valid SQL that returns the wrong rows.",
  "The first run (before a prompt fix) had the agent about 3 points behind the baseline. 13 of its 32 wrong answers added helpful extra columns, which Spider's strict scoring rejects, and one was lost to a parsing bug. Fixing both closed the gap.",
  "Agreement between candidate queries is a useful confidence signal: when all five return the same rows, accuracy is 91 to 97%; when they split, it drops to 33 to 70%. That points to where a clarifying question or a warning belongs.",
  "Some misses trace to errors in Spider's own gold queries. A second, unseen sample is still running, and the small-model column covers 86 of 100 questions so far.",
];

export default function DataAnalystPage() {
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
            <p className="eyebrow">LLM Agents &middot; Text-to-SQL &middot; 2026</p>
            <h1>
              Data Analyst Agent: ask your data{" "}
              <span className="gradientText">in plain English</span>
            </h1>
            <p className="htLead">
              It writes SQL, runs it read-only, reads the result, fixes its own mistakes and answers. Its accuracy is
              measured on the public Spider benchmark, and where it fails is reported, not hidden.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a href={ANALYST_REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btnGhost">
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

        <section id="try" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Try it</p>
            <h2>Ask a database a question</h2>
            <p>
              Use the made-up demo shop or upload your own CSV. The server is on a free plan that sleeps when idle; this
              page wakes it as soon as you arrive, and a short tour plays while it starts.
            </p>
          </div>
          <AnalystDemo />
        </section>

        <section id="results" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Evaluation</p>
            <h2>What the benchmark showed</h2>
            <p>
              Execution accuracy on a reproducible 100-question sample of Spider&apos;s development set: the predicted and gold
              queries must return the same rows. Each model was tested separately, with the same questions for every row.
            </p>
          </div>
          <div className="toolkitCard eaTableWrap">
            <table className="eaTable">
              <thead>
                <tr>
                  <th scope="col">Configuration</th>
                  <th scope="col">Larger model</th>
                  <th scope="col">Smaller model</th>
                  <th scope="col">Tokens per question</th>
                </tr>
              </thead>
              <tbody>
                {ANALYST_RESULTS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.large}</td>
                    <td>{row.small}</td>
                    <td>{row.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cvNote">
            With 100 questions, differences of a few points are within noise. Models are two free Groq models; the smaller model&apos;s
            figures cover the 86 questions finished so far.
          </p>
          <div className="toolkitCard eaTableWrap">
            <table className="eaTable">
              <thead>
                <tr>
                  <th scope="col">Majority vote: how much the candidates agreed</th>
                  <th scope="col">Larger model</th>
                  <th scope="col">Smaller model</th>
                </tr>
              </thead>
              <tbody>
                {ANALYST_AGREEMENT.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.large}</td>
                    <td>{row.small}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="toolkitCard">
            <ul className="eaLimits">
              {findings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Design</p>
            <h2>What makes it safe to use</h2>
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
