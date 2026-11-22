import type { Metadata } from "next";
import Link from "next/link";
import ModelLabDemo from "@/components/ModelLabDemo";
import ModelLabBoard from "@/components/ModelLabBoard";
import ProjectBanner from "@/components/ProjectBanner";
import SocialLinks from "@/components/SocialLinks";
import { MODEL_LAB_REPO_URL } from "@/data/modelLab";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Model Lab | Mc-Kelly Pepple",
  description:
    "Upload a spreadsheet and get a trained model plus an honest account of how far to trust it: leak detection, a fair comparison against a baseline, a held-out test score with an interval, a prediction form and drift monitoring. Its own claims are checked on public datasets.",
  alternates: { canonical: "/model-lab" },
  openGraph: {
    title: "Model Lab | Mc-Kelly Pepple",
    description: "Train a model on your spreadsheet and see how far to trust it. The tool is itself benchmarked.",
    type: "article",
    url: "/model-lab",
  },
};

const stack = ["Machine learning", "scikit-learn", "Cross-validation", "Leakage detection", "Drift monitoring", "Evaluation", "NumPy", "GitHub Actions", "Render", "Python"];

const facts = [
  { label: "Checks", value: "Leaks, baseline, held-out test" },
  { label: "Models", value: "Five classical, same footing" },
  { label: "Deploy", value: "A prediction form for your columns" },
  { label: "Evaluation", value: "Its own claims, on public datasets" },
];

const steps = [
  { title: "Read and profile", text: "The file is parsed in memory. Each column is typed as number, category, ID or free text, and columns that cannot help (IDs, free text, mostly empty) are left out with the reason shown." },
  { title: "Set 20% of the rows aside", text: "Before any model is tried, a fifth of the rows are locked away. They are scored once, at the very end." },
  { title: "Look for columns that give the answer away", text: "Each column is tried on its own with a tiny decision tree. A column that nearly solves the task by itself is flagged and excluded, and the score you would have seen with it is shown for contrast." },
  { title: "Compare five models fairly", text: "A baseline that always guesses the most common answer, a small tree, a linear or logistic model, gradient boosting and a random forest. Each gets 5-fold cross-validation on the training rows, with all cleaning and encoding fitted inside each fold so nothing leaks between folds." },
  { title: "Choose the simplest good model", text: "The winner is the simplest model within one standard error of the best score. It is only called useful if it beats the baseline in a paired comparison, by a margin that is more than noise." },
  { title: "Score the locked-away rows once", text: "The chosen model is scored on the held-out rows, with a 95% interval from resampling, next to the baseline on the same rows." },
  { title: "Explain, serve and watch", text: "Permutation importance and a confusion matrix or predicted-against-actual plot explain what it does. A prediction form is generated from your columns and warns about values outside the range it saw. The monitor then compares newer data against the training data, column by column." },
];

const design = [
  { title: "A baseline to beat", text: "A model's score means little without the score of doing nothing clever. The page always shows both, and says so plainly when the model is not clearly better." },
  { title: "Leaks are caught, not rewarded", text: "The most common way a model looks brilliant and fails in real use is a column that only exists after the outcome. Model Lab finds the obvious ones and shows how misleading they would have been." },
  { title: "The test rows are touched once", text: "Choosing among models on the same rows used to report the score inflates it. Here the choice is made on cross-validation and the held-out rows are scored a single time." },
  { title: "Intervals, not just numbers", text: "Every score comes with an interval. With few rows the page warns that small differences between models should not be read." },
  { title: "Imbalance is handled in the open", text: "When one answer makes up 70% or more of the rows, plain accuracy rewards always guessing it, so scores switch to balanced accuracy and the page says so." },
  { title: "Drift is measured, not guessed", text: "Newer data is compared with the training data using the Population Stability Index, after subtracting the amount two samples of the same data differ by chance. If the new file has the answers, the real score is shown." },
  { title: "Your file stays yours", text: "Uploads are held in memory only, never written to disk or logged, and the trained model is forgotten after an hour. There are limits on size, rows and columns." },
];

const method = [
  "Public datasets from OpenML (plus California housing from scikit-learn), spanning two-class, multi-class and numeric targets. Datasets Model Lab declines or cannot load (for example, more than 40 columns) are listed as skipped rather than replaced.",
  "For each dataset and each of three split seeds, 30% of the rows are kept back by the benchmark script, where Model Lab cannot see them. The rest is given to Model Lab exactly like an upload.",
  "Pick quality: the Lab's model and every candidate are scored on the kept-back rows. Regret is the best candidate's score minus the Lab's.",
  "Stated score: how far the Lab's own held-out score was from the kept-back score, and how often its 95% interval contained it.",
  "False alarms: the answer column is shuffled so no signal exists. Model Lab should not say it beats the baseline.",
  "Leak catching: a copy of the answer (1% of values altered) is added as a new column. Model Lab should flag it. On the unmodified data, any flagged column is counted as a false flag.",
  "The run is a GitHub Actions workflow in the repository. Every per-dataset record is committed next to the summary, and this page reads the summary file.",
];

const limits = [
  "It is tables only (CSV up to 1 MB, 5,000 rows, 40 columns), and large files are sampled down to 2,000 rows to keep the demo quick.",
  "Five classical models with sensible defaults and no hyperparameter search. It is a careful first pass, not a competition entry, and a heavily tuned model could do better.",
  "The leak scan catches a single column that nearly solves the task. It cannot catch a leak spread across several columns, or a column that is only available after the outcome but weakly related to it. Knowing when each column becomes available is something only you can check.",
  "A good held-out score says the model works on data like this file. It does not say it works on different people, a different season or a changed process, which is what the monitor is for.",
  "The benchmark's kept-back rows are themselves a sample, so the stated interval is expected to contain the kept-back score somewhat less than 95% of the time. The typical gap is the number to read.",
  "Training runs on a small shared server, so larger files take a minute or two and the demo limits how many runs each visitor can start.",
];

export default function ModelLabPage() {
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
            <p className="eyebrow">Machine learning &middot; Flagship</p>
            <h1>
              Model Lab: train a model on your spreadsheet, <span className="gradientText">and see how far to trust it</span>
            </h1>
            <p className="htLead">
              Upload a table, pick the column to predict, and get a trained model with the checks that stop a single impressive number from lying: leaks, a baseline to beat, a test score
              with an interval, a prediction form and drift monitoring. The tool&apos;s own claims are tested on public datasets.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a href={MODEL_LAB_REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btnGhost">
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

        <ProjectBanner kind="lab" />

        <section id="try" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Try it</p>
            <h2>Train something</h2>
            <p>
              Start with a practice dataset or upload a CSV. The &ldquo;Churn with a leak&rdquo; sample is a good first run: watch the answer-giveaway column get caught. The server
              sleeps when idle; this page wakes it as soon as you arrive, and a short tour plays while it starts.
            </p>
          </div>
          <ModelLabDemo />
        </section>

        <section id="results" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Evaluation</p>
            <h2>Does Model Lab keep its promises?</h2>
            <p>The tool is run on public datasets against rows it never saw, and its claims are checked against what actually happened.</p>
          </div>
          <ModelLabBoard />
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
            <p className="eyebrow">How it works</p>
            <h2>From a spreadsheet to a checked model</h2>
          </div>
          <div className="toolkitCard">
            <ol className="vtSteps">
              {steps.map((item) => (
                <li key={item.title}>
                  <div>
                    <b>{item.title}</b>
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ol>
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
