import Link from "next/link";
import DemoSection from "@/components/DemoSection";
import SocialLinks from "@/components/SocialLinks";
import type { Demo } from "@/data/demos";

const EMAIL = "mckelly2014@gmail.com";

export default function DemoPage({ demo }: { demo: Demo }) {
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
            <p className="eyebrow">{demo.eyebrow}</p>
            <h1>
              {demo.lead} <span className="gradientText">{demo.accent}</span>
            </h1>
            <p className="htLead">{demo.intro}</p>
            <div className="heroActions">
              <a href="#try" className="btn btnPrimary">
                Try it
              </a>
              <a
                href={demo.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnGhost"
              >
                View source
                <span className="srOnly"> (opens in a new tab)</span>
              </a>
            </div>
            <ul className="htStack" aria-label="Technologies">
              {demo.stack.map((item) => (
                <li key={item} className="projectTag">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <dl className="toolkitCard demoFacts">
            {demo.facts.map((fact) => (
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
            <h2>{demo.tryHeading}</h2>
            <p>{demo.tryText}</p>
          </div>
          <DemoSection
            probe={demo.probe}
            label={demo.statusLabel}
            appUrl={demo.appUrl}
            embed={demo.embed}
            openLabel={demo.openLabel}
            frameTitle={demo.frameTitle}
            extra={
              demo.extra
                ? {
                    href: `mailto:${EMAIL}?subject=${encodeURIComponent(demo.extra.subject)}`,
                    label: demo.extra.label,
                  }
                : undefined
            }
          />
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">{demo.pointsEyebrow}</p>
            <h2>{demo.pointsHeading}</h2>
            <p>{demo.pointsText}</p>
          </div>
          <div className="toolkitGrid demoPoints">
            {demo.points.map((point) => (
              <div key={point.title} className="toolkitCard">
                <h3>{point.title}</h3>
                <p className="htCardText">{point.text}</p>
              </div>
            ))}
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
