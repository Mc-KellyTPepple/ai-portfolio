import type { Metadata } from "next";
import Link from "next/link";
import ServiceStatus from "@/components/ServiceStatus";
import SocialLinks from "@/components/SocialLinks";
import {
  HABIT_API_URL,
  HABIT_REPO_URL,
  TEST_LINKS,
} from "@/data/habitTracker";

const EMAIL = "mckelly2014@gmail.com";

export const metadata: Metadata = {
  title: "Habit Tracker | Mc-Kelly Pepple",
  description:
    "A full-stack habit tracker with smart push reminders: React Native (Expo), Supabase and a Node.js service on Render. Try the live reminder backend.",
  alternates: { canonical: "/habit-tracker" },
  openGraph: {
    title: "Habit Tracker | Mc-Kelly Pepple",
    description:
      "React Native, Supabase and Node.js habit tracker with retrying push reminders.",
    type: "article",
    url: "/habit-tracker",
  },
};

const reminderSteps = [
  {
    title: "Scheduled every hour",
    text: "A Supabase scheduled job runs on the hour and finds habits whose reminder time is due and not yet checked in today.",
  },
  {
    title: "Up to three attempts",
    text: "The reminder service sends a push notification, then retries at 5-minute intervals, never more than three attempts per habit per day.",
  },
  {
    title: "Stops when it should",
    text: "Retries stop as soon as Expo's push service accepts the message, or the moment you check the habit in.",
  },
  {
    title: "Retires abandoned habits",
    text: "A habit with no check-in for three days stops getting reminders. Nothing is deleted, so history is kept.",
  },
];

const architecture = [
  { name: "Mobile app", note: "React Native, Expo" },
  { name: "Supabase", note: "Auth, Postgres, RLS" },
  { name: "Scheduler", note: "pg_cron, hourly" },
  { name: "Reminder API", note: "Node.js, Render" },
  { name: "Expo Push", note: "to the phone" },
];

const engineering = [
  {
    title: "Data isolation",
    text: "Row Level Security means each user can only ever read and write their own habits and check-ins, enforced in the database.",
  },
  {
    title: "Secrets kept server-side",
    text: "The privileged database key lives only on the reminder service. The scheduler reads its endpoint and shared secret from Supabase Vault.",
  },
  {
    title: "Safe retries",
    text: "Attempts are counted in the database before each send, so overlapping runs cannot exceed the daily limit.",
  },
];

const stack = [
  "React Native",
  "Expo",
  "Supabase",
  "PostgreSQL",
  "Node.js",
  "TypeScript",
  "Docker",
  "Render",
  "Expo Push",
];

const hasTestLinks = Boolean(TEST_LINKS.webApp || TEST_LINKS.androidApk);

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
            <p className="eyebrow">Mobile &amp; Full-Stack &middot; 2026</p>
            <h1>
              Habit Tracker with{" "}
              <span className="gradientText">reminders that retry</span>
            </h1>
            <p className="htLead">
              A mobile habit tracker that nudges you if you have not checked in.
              It sends a push reminder, confirms Expo accepted it, and retries
              only when needed, then quietly stops bothering you when a habit
              goes cold.
            </p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
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

          <ServiceStatus apiUrl={HABIT_API_URL} />
        </section>

        <section id="how" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">How reminders work</p>
            <h2>Three tries, then it lets go</h2>
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
                Install the Android app (or open the web version) and create an
                account with an email and password.
              </li>
              <li>
                Add a habit and set its reminder time to the <strong>next
                full hour</strong>. Reminders are checked on the hour.
              </li>
              <li>
                Leave it unchecked. At that hour you should get a push
                notification on your phone.
              </li>
              <li>
                Check the habit in before the hour to see that no reminder
                is sent.
              </li>
            </ol>

            <div className="htTryActions">
              {TEST_LINKS.webApp && (
                <a
                  href={TEST_LINKS.webApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnPrimary"
                >
                  Open web app
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              )}
              {TEST_LINKS.androidApk && (
                <a
                  href={TEST_LINKS.androidApk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnGhost"
                >
                  Download Android app
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              )}
              {!hasTestLinks && (
                <a
                  href={`mailto:${EMAIL}?subject=Habit%20Tracker%20test%20access`}
                  className="btn btnPrimary"
                >
                  Request test access
                </a>
              )}
            </div>
            <p className="cvNote">
              The web version tracks habits and check-ins. Push reminders
              need the Android app on a real phone, not a browser or emulator.
            </p>
          </div>
        </section>

        <section id="architecture" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Architecture</p>
            <h2>How the pieces fit</h2>
            <p>
              A phone cannot run a scheduled job while the app is closed, so a
              small server does the one job that genuinely needs one.
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
