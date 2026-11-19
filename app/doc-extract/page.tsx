import type { Metadata } from "next";
import Link from "next/link";
import DocExtractDemo from "@/components/DocExtractDemo";
import AccuracyBoard from "@/components/AccuracyBoard";
import SocialLinks from "@/components/SocialLinks";
import { DOCX_REPO_URL } from "@/data/docExtract";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Doc Extract | Mc-Kelly Pepple",
  description:
    "A vision model reads receipts and invoices into structured data, an arithmetic validator flags what does not add up, and it is measured on the public CORD set against OCR baselines. Groq-hosted models, cloud hosting.",
  alternates: { canonical: "/doc-extract" },
  openGraph: {
    title: "Doc Extract | Mc-Kelly Pepple",
    description: "Receipt and invoice extraction with a vision model and arithmetic validation, measured against OCR baselines.",
    type: "article",
    url: "/doc-extract",
  },
};

const stack = ["Multimodal AI", "Vision LLM", "Document AI", "OCR baselines", "Validation", "Groq", "GitHub Actions", "Render", "Python"];

const facts = [
  { label: "Task", value: "Receipt image to structured JSON" },
  { label: "Safety net", value: "Arithmetic check, flag for review" },
  { label: "Evaluation", value: "CORD v2 receipts vs OCR baselines" },
  { label: "Hosting", value: "Render, wakes on visit" },
];

const configs = [
  { title: "OCR + keyword rules", text: "Tesseract text and simple rules. Finds the total, subtotal and tax only. The floor to beat; it uses no model." },
  { title: "OCR + text model", text: "Tesseract text, then a text model writes the JSON. The classic two-stage pipeline." },
  { title: "Vision model", text: "A vision model reads the image directly and writes the JSON in one call." },
  { title: "Vision + verification", text: "The same, then the validator checks the arithmetic. If a check fails, the model sees which one and looks again, once. Whatever still fails is flagged for a person." },
];

const design = [
  {
    title: "It checks itself",
    text: "A receipt is redundant: line prices add up to the subtotal, and subtotal plus tax and service minus any discount equals the total. When an extraction breaks that, a number was misread.",
  },
  {
    title: "It flags instead of guessing",
    text: "The model is told to copy what is printed and use null otherwise. If the sums still disagree after the second look, the document is marked for review and no number is invented to make it fit.",
  },
  {
    title: "A validator that does not cry wolf",
    text: "Tax already included in prices, service charges, discounts and small rounding are accepted. A check that fires on normal receipts is as useless as one that never fires.",
  },
  {
    title: "Your image stays yours",
    text: "Photos are shrunk in your browser, processed in memory on the server and never stored or logged.",
  },
];

const lessons = [
  "The first benchmark run measured my prompt, not the model. Receipts in the dataset print Indonesian rupiah with a thousands dot, so 60,000 appears as \"60.000\". The prompt asked for plain numbers, and the model wrote that as the JSON number 60.0. In the 45 vision receipts scored, 11 of the 15 wrong ones were this single mistake, a factor of 1,000 on every field.",
  "The arithmetic check could not catch it. When every amount on a receipt is scaled by the same factor, the sums still agree. That is a real limit of validating by arithmetic: it finds misread digits, not a consistent change of scale.",
  "The fix is to ask for amounts as text exactly as printed and read the scale in code. It is deployed, covered by tests, and the benchmark was re-run from scratch on all 100 receipts. The first run is kept in the repository as evidence.",
  "Even in that flawed run, reading the image directly was far ahead of OCR followed by a text model (about two thirds of receipts fully right against under a fifth), but those numbers carried the bug too, so they are not reported as results.",
  "The clean re-run held up that ordering (every key field right on 88% of receipts against 24%), and it taught me something I had not expected: the arithmetic check and the re-read did not improve accuracy. Most of the vision model's mistakes are a missed line or an empty tax field, and those leave the sums consistent. I report that plainly because a check that looks clever but measures as neutral is exactly what the benchmark is for.",
];

const limits = [
  "CORD receipts are Indonesian, photographed and mostly food and drink. Results do not automatically carry over to other languages, long multi-page invoices or handwriting.",
  "The sample is 100 receipts, so differences smaller than about ten points are noise. Intervals are published with the numbers.",
  "Arithmetic validation cannot catch an error that keeps the sums consistent, such as a wrong scale on every field or two misread digits that cancel out.",
  "The daily model quota limits how many receipts can be processed per day, which is why the benchmark takes several days.",
];

export default function DocExtractPage() {
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
            <p className="eyebrow">Multimodal AI &middot; Document AI</p>
            <h1>
              Doc Extract: receipts to data, <span className="gradientText">flagged when it does not add up</span>
            </h1>
            <p className="htLead">
              A vision model reads a receipt or invoice into structured data. Then the document is checked against itself: if the
              lines, tax and total do not agree, it is sent to a person instead of being trusted.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a href={DOCX_REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btnGhost">
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

        <figure className="projectBanner dxHeroImage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doc-extract/banner.webp"
            width={1600}
            height={900}
            alt="Concept artwork: an invoice on a desk next to a laptop showing a document being uploaded, processed and returned as structured JSON"
            decoding="async"
          />
          <figcaption>Concept artwork. The live demo below is the real thing.</figcaption>
        </figure>

        <section id="try" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Try it</p>
            <h2>Read a receipt</h2>
            <p>
              Pick a sample or upload your own. The server sleeps when idle; this page wakes it as soon as you
              arrive, and a short tour plays while it starts. One sample is misprinted on purpose so you can see the review flag.
            </p>
          </div>
          <DocExtractDemo />
        </section>

        <section id="results" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Evaluation</p>
            <h2>How it is measured</h2>
            <p>
              A fixed sample of 100 receipts from the public CORD test set (CC BY 4.0), the same receipts for every configuration.
              Totals, subtotals and tax are scored by exact match, line items by F1, and the review flag by how often flagged
              receipts are actually wrong.
            </p>
          </div>
          <div className="toolkitGrid demoPoints">
            {configs.map((item) => (
              <div key={item.title} className="toolkitCard">
                <h3>{item.title}</h3>
                <p className="htCardText">{item.text}</p>
              </div>
            ))}
          </div>

          <AccuracyBoard />
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">What the first run taught me</p>
            <h2>A bug the check could not see</h2>
          </div>
          <div className="toolkitCard">
            <ul className="eaLimits">
              {lessons.map((item) => (
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
