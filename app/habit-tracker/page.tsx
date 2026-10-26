import type { Metadata } from "next";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { HABIT_APP_URL, HABIT_REPO_URL } from "@/data/habitTracker";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Habit Tracker | Mc-Kelly Pepple",
  description:
    "An installable habit tracker for phone and desktop that sends three push reminders a day and stops the moment one is delivered. Static frontend, Supabase Postgres, pg_cron and Edge Functions. Try the live app.",
  alternates: { canonical: "/habit-tracker" },
  openGraph: {
    title: "Habit Tracker | Mc-Kelly Pepple",
    description:
      "Installable habit tracker with three daily push reminders that stop on delivery. Static frontend, Supabase pg_cron and Edge Functions.",
    type: "article",
    url: "/habit-tracker",
  },
};

const reminderSteps = [
  {
    title: "Three reminders a day",
    text: "Each habit has three reminder times in your own time zone. A scheduled database job turns them into that day's reminders and skips any habit already marked done.",
  },
  {
    title: "Confirmed by the device",
    text: "When a push arrives, the app's service worker confirms delivery straight to the database. That confirmation is what ends the retries.",
  },
  {
    title: "Retries only when needed",
    text: "If a push is not confirmed, it is retried every 3 minutes, at most six times. Tapping Done on the notification also stops the rest of that day's reminders.",
  },
  {
    title: "Habits expire after 3 days",
    text: "A habit with no Done and no notification tap for three days is removed automatically, so abandoned habits stop sending reminders.",
  },
];

const architecture = [
  { name: "Static web app (PWA)", note: "HTML, JS, service worker" },
  { name: "Supabase Postgres", note: "RPC functions, RLS" },
  { name: "Scheduler", note: "pg_cron, every minute" },
  { name: "Edge Function", note: "Web Push, only when due" },
  { name: "Push services", note: "Browser and phone vendors" },
];

const engineering = [
  {
    title: "Never sleeps, never polls",
    text: "The frontend is a static site, so there is no server to cold-start. The app loads data when opened and refreshes when you return to it, with no polling.",
  },
  {
    title: "Cheap by design",
    text: "The scheduler is plain SQL. It calls the Edge Function only when a reminder is actually due, so idle minutes cost almost nothing.",
  },
  {
    title: "Locked-down data",
    text: "Tables have Row Level Security with no direct access. The app uses secret-keyed database functions, and the push keys sit in a private schema the public API cannot read.",
  },
];

const facts = [
  { label: "Frontend", value: "Static PWA, no build step" },
  { label: "Backend", value: "Supabase Postgres + Edge Functions" },
  { label: "Scheduling", value: "pg_cron, SQL-only tick" },
  { label: "Hosting", value: "Render static site (free)" },
];

const stack = [
  "PWA",
  "Web Push",
  "Service Worker",
  "Supabase",
  "PostgreSQL",
  "pg_cron",
  "Edge Functions",
  "Deno",
  "Render",
];

export default function HabitTrackerPage() {
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
            <p className="eyebrow">Full-Stack &middot; PWA &middot; 2026</p>
            <h1>
              Habit Tracker with{" "}
              <span className="gradientText">reminders that stop on delivery</span>
            </h1>
            <p className="htLead">
              An installable habit tracker for phone and desktop. It sends
              three push reminders a day per habit, stops the moment the
              device confirms delivery, and quietly retires habits you have
              abandoned.
            </p>
            <div className="heroActions">
              <a
                href={HABIT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnPrimary"
              >
                Open the app
                <span className="srOnly"> (opens in a new tab)</span>
              </a>
              <a
                href={HABIT_REPO_URL}
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

        <section id="how" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">How reminders work</p>
            <h2>Three a day, then it lets go</h2>
            <p>
              The reminder policy is the interesting part of this project.
            </p>
          </div>
          <ol className="htSteps">
            {reminderSteps.map((step, i) => (
              <li key={step.title} className="toolkitCard htStep">
                <span className="htStepNum" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="try" className="section">
          <div className="contactCard htTry">
            <p className="eyebrow">Try it yourself</p>
            <h2>Test the app in a few minutes</h2>

            <ol className="htTrySteps">
              <li>
                Open the app in Chrome, Edge or Safari. On iPhone, add it to
                your Home Screen first.
              </li>
              <li>
                Tap <strong>Enable notifications</strong> and allow them.
              </li>
              <li>
                Add a habit and set one reminder a couple of minutes from
                now.
              </li>
              <li>
                When the notification arrives, tap <strong>Done</strong> to
                finish the habit for the day, or ignore it and watch the
                retries stop on their own.
              </li>
            </ol>

            <div className="htTryActions">
              <a
                href={HABIT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnPrimary"
              >
                Open web app
                <span className="srOnly"> (opens in a new tab)</span>
              </a>
            </div>
            <p className="cvNote">
              No account needed. Each browser or phone is its own device, so
              habits do not sync across devices.
            </p>
          </div>
        </section>

        <section id="architecture" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Architecture</p>
            <h2>How the pieces fit</h2>
            <p>
              A closed browser tab cannot run a scheduled job, so the database
              schedules the reminders and one small function sends them.
            </p>
          </div>

          <ol className="htFlow" aria-label="Request flow">
            {architecture.map((node) => (
              <li key={node.name} className="htFlowNode">
                <strong>{node.name}</strong>
                <span>{node.note}</span>
              </li>
            ))}
          </ol>

          <div className="toolkitGrid htEngineering">
            {engineering.map((item) => (
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
            <p>
              Machine learning, computer vision and deployable AI systems,
              taken from experiment to something you can open and try.
            </p>
            <div className="htTryActions">
              <Link href="/#projects" className="btn btnPrimary">
                All projects
              </Link>
              <a
                href={`mailto:${EMAIL}`}
                className="btn btnGhost"
              >
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
