import ContactButton from "@/components/ContactButton";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks, { SOCIAL } from "@/components/SocialLinks";
import { projects } from "@/data/projects";

const EMAIL = "mckelly2014@gmail.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mc-Kelly Pepple",
  jobTitle: "AI / ML Engineer & Full Stack Developer",
  knowsAbout: [
    "Machine Learning",
    "Computer Vision",
    "Full Stack Development",
    "PyTorch",
    "Python",
    "React",
    "Node.js",
  ],
  url: "https://ai-portfolio-pearl-ten.vercel.app",
  sameAs: [SOCIAL.github, SOCIAL.linkedin],
};

const toolkit = [
  {
    title: "Machine learning & vision",
    items: [
      "Python",
      "PyTorch",
      "MobileNetV3",
      "MobileFaceNet",
      "ONNX Runtime",
      "INT8 Quantization",
      "Image Classification",
      "Recommendation Systems",
    ],
  },
  {
    title: "Full-stack & mobile",
    items: ["React", "Next.js", "React Native", "Expo", "Node.js", "Supabase"],
  },
  {
    title: "Deployment",
    items: ["Vercel", "Render", "CPU inference", "Live APIs"],
  },
];

const principles = [
  {
    title: "Engineering first",
    text: "Clean, maintainable systems built with an engineer's discipline, not just a model that scores well.",
  },
  {
    title: "Beyond the notebook",
    text: "Every project is taken from experiment to a usable application someone can open and try.",
  },
  {
    title: "Deployed, not just demoed",
    text: "Live projects with real endpoints, built to run on modest hardware and work in the real world.",
  },
];

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);
  const years = featuredProjects.map((p) => Number(p.year));
  const span = `${Math.min(...years)}\u2013${Math.max(...years)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Nav />

      <main id="top">
        <section className="hero">
          <div className="heroGlow" aria-hidden="true" />
          <div className="heroContent">
            <p className="statusBadge">
              <span className="statusDot" aria-hidden="true" />
              Open to AI / ML and full stack opportunities
            </p>

            <p className="eyebrow">
              AI / ML Engineer &middot; Full Stack Developer &middot; Computer Vision
            </p>

            <h1>
              I build and deploy{" "}
              <span className="gradientText">scalable intelligent applications</span>
              , from computer vision models to full stack products.
            </h1>

            <p className="heroDescription">
              I am an AI / ML engineer and full stack developer. I use PyTorch
              and Python for machine learning and computer vision, and React
              and Node.js for the applications built around them.
            </p>

            <div className="heroActions">
              <a href="#projects" className="btn btnPrimary">
                View projects
              </a>
              <a href="#contact" className="btn btnGhost">
                Contact me
              </a>
            </div>

            <SocialLinks variant="labeled" className="heroSocial" />

            <dl className="stats">
              <div>
                <dt>Deployed projects</dt>
                <dd>{featuredProjects.length}</dd>
              </div>
              <div>
                <dt>Project timeline</dt>
                <dd>{span}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>ML &middot; Vision &middot; Full-stack</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Selected work</p>
            <h2>Projects</h2>
            <p>
              AI systems taken from experimentation through to live
              deployment.
            </p>
          </div>

          <div className="projectsGrid">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                featured={index === 0}
              />
            ))}
          </div>
        </section>

        <section id="toolkit" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Toolkit</p>
            <h2>What I build with</h2>
            <p>The tools behind the projects above.</p>
          </div>

          <div className="toolkitGrid">
            {toolkit.map((group) => (
              <div key={group.title} className="toolkitCard">
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <div className="aboutGrid">
            <div className="aboutIntro">
              <p className="eyebrow">About</p>
              <h2>Engineering focused. AI driven.</h2>
              <p>
                I combine machine learning with full stack engineering to
                build and deploy scalable systems that solve real problems,
                from the model to the interface people actually use.
              </p>
            </div>

            <ul className="principles">
              {principles.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="contactCard">
            <p className="eyebrow">Let&apos;s work together</p>
            <h2>Have an AI problem worth solving?</h2>
            <p>
              I am available for AI / ML engineering, full stack development,
              and computer vision opportunities.
            </p>
            <ContactButton email={EMAIL} />
            <SocialLinks variant="labeled" className="contactSocial" />
            <p className="cvNote">
              Full CV available on request, shared directly and on a
              case-by-case basis.
            </p>
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
