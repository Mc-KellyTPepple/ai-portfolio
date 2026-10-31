import type { Metadata } from "next";
import Link from "next/link";
import EdgarDemo from "@/components/EdgarDemo";
import SocialLinks from "@/components/SocialLinks";
import { EDGAR_REPO_URL, EDGAR_RESULTS } from "@/data/edgarAnalyst";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "EDGAR Analyst | Mc-Kelly Pepple",
  description:
    "A research agent that answers questions about SEC 10-K filings with calculator-checked numbers and filing citations, plus an automatic evaluation suite. Free Groq models, free hosting. Ask it a question.",
  alternates: { canonical: "/edgar-analyst" },
  openGraph: {
    title: "EDGAR Analyst | Mc-Kelly Pepple",
    description:
      "Agent over SEC 10-K filings with cited answers, honest refusals and a measured evaluation suite.",
    type: "article",
    url: "/edgar-analyst",
  },
};

const stack = [
  "LLM agents",
  "Tool use",
  "Evaluation",
  "Hybrid retrieval",
  "SQLite FTS5",
  "Embeddings",
  "Groq",
  "GitHub Actions",
  "Render",
  "Python",
];

const facts = [
  { label: "Data", value: "10-K filings of 10 large tech companies" },
  { label: "Models", value: "Free Groq models with automatic fallback" },
  { label: "Evaluation", value: "187-question suite plus two held-out sets" },
  { label: "Hosting", value: "Render free plan (sleeps when idle)" },
];

const design = [
  {
    title: "Numbers come from tools, not from the model",
    text: "Structured facts are looked up in a database and ratios and growth are computed by a calculator tool, so the model does not do arithmetic in its head. Every answer cites the filing accession numbers it used.",
  },
  {
    title: "It says no when it should",
    text: "Questions the filings cannot answer, such as future years or companies outside the set, get a grounded refusal. Refusals are scored in the evaluation, and a closed-book baseline without the tools answers only 17.3% of the answerable questions.",
  },
  {
    title: "Retrieval over filing text",
    text: "For facts that only appear in prose, such as employee counts, it searches Item 1, 1A and 7 with keyword search and local embeddings fused by reciprocal rank fusion.",
  },
  {
    title: "Built for a free quota",
    text: "A rate limiter, a fallback chain across three Groq models, a response cache and a daily ledger keep it inside free limits. The web service adds per-visitor and daily caps.",
  },
];

const limits = [
  "The held-out sets reuse the same question templates and the same 10 companies, so they test unseen questions, not unseen kinds of question.",
  "They contain no refusal or filing-text questions, and results came from a mix of prompt versions and models, partly the smaller 20B model.",
  "Three of the 23 filing-text questions are still wrong (rounded or wrong numbers), for example Amazon's employee count.",
  "On the free tier the first answer after idle can be slow, and the shared daily quota can run out, in which case the demo says so.",
];

export default function EdgarAnalystPage() {
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
            <p className="eyebrow">LLM Agents &middot; Evaluation &middot; 2026</p>
            <h1>
              EDGAR Analyst: an agent for SEC filings{" "}
              <span className="gradientText">that shows its evidence</span>
            </h1>
            <p className="htLead">
              Ask a question about a company&apos;s 10-K and get a calculator-checked answer
              with the filings it came from, or an honest refusal. It ships with an automatic
              evaluation suite, so the accuracy numbers below are measured, not claimed.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a
                href={EDGAR_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnGhost"
              >
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
            <h2>Ask about a 10-K</h2>
            <p>
              The API runs on a free server that sleeps when idle. This page wakes it as soon as
              you arrive. The first start takes about a minute, so there is a walkthrough of real runs to read while it loads.
            </p>
          </div>
          <EdgarDemo />
        </section>

        <section id="results" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Evaluation</p>
            <h2>Measured accuracy</h2>
            <p>
              Answers are graded automatically against values computed from the filings. The
              full agent has the filing-text search; the facts agent does not.
            </p>
          </div>
          <div className="toolkitCard eaTableWrap">
            <table className="eaTable">
              <thead>
                <tr>
                  <th scope="col">Question set</th>
                  <th scope="col">Facts agent</th>
                  <th scope="col">Full agent</th>
                </tr>
              </thead>
              <tbody>
                {EDGAR_RESULTS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.facts}</td>
                    <td>{row.full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cvNote">
            Without tools, a closed-book model answers 17.3% of answerable questions correctly
            and refuses 71.4% of the unanswerable ones.
          </p>
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
            <p className="eyebrow">Honest limits</p>
            <h2>What these numbers do not show</h2>
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
            <p>
              Machine learning, computer vision and deployable AI systems, taken from
              experiment to something you can open and try.
            </p>
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
