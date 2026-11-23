import ContactButton from "@/components/ContactButton";
import HeroPortrait from "@/components/HeroPortrait";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks, { SOCIAL } from "@/components/SocialLinks";
import { projects } from "@/data/projects";

const EMAIL = "mckelly2014@gmail.com";
const CV_URL = "/McKelly-Pepple-CV.pdf";

// EDGAR Analyst, Data Analyst Agent and Doc Extract publish their benchmark results, including failures.
const PUBLISHED_EVALUATIONS = 6;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mc-Kelly Pepple",
  jobTitle: "Applied AI / AI Systems Engineer",
  knowsAbout: [
    "Machine Learning",
    "LLMs",
    "AI Agents",
    "RAG",
    "Multimodal AI",
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

type BackgroundItem = { head: string; meta?: string; text?: string };

const background: { title: string; items: BackgroundItem[] }[] = [
  {
    title: "Experience",
    items: [
      {
        head: "Lecturer I, Federal Polytechnic of Oil and Gas Bonny",
        meta: "2018 – present",
        text: "Applied research in AI, machine learning and computer vision. Head of Department; chair of the examination moderation and appraisal committees; supervised 10+ undergraduate projects.",
      },
    ],
  },
  {
    title: "Education",
    items: [
      { head: "PhD (in view), Electronic and Computer Engineering", meta: "University of Nigeria, Nsukka · 2021 – present" },
      { head: "M.Sc., Systems and Control", meta: "Coventry University, UK · 2013 – 2014" },
      { head: "B.Tech., Computer Engineering", meta: "Rivers State University · 2003 – 2008" },
    ],
  },
  {
    title: "Research",
    items: [
      { head: "10+ peer-reviewed papers", meta: "2020 – 2025", text: "and 9 national and international conference presentations." },
      { head: "IECEC 2026", meta: "University of Nigeria, Nsukka", text: "Face recognition with EfficientNet and Swin Transformer (VGGFace2; LFW, AgeDB30, CALFW, CPLFW), and clinical image denoising with a noise-aware channel-attention U-Net." },
    ],
  },
  {
    title: "Credentials",
    items: [
      { head: "COREN registered engineer" },
      { head: "Python Developer Certificate", meta: "freeCodeCamp" },
      { head: "Intermediate Machine Learning", meta: "Kaggle" },
      { head: "TETFund AST&D Scholarship", meta: "2021 – present" },
    ],
  },
];

const toolkit = [
  {
    title: "LLMs, agents & retrieval",
    items: [
      "LLM agents",
      "Tool use",
      "RAG",
      "Hybrid retrieval",
      "Reranking",
      "Text-to-SQL",
      "Evaluation",
      "Groq",
    ],
  },
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
    title: "Full-stack & deployment",
    items: ["React", "Next.js", "Node.js", "Supabase", "PWA", "Vercel", "Render", "GitHub Actions"],
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
          <div className="heroGrid">
          <div className="heroContent">
            <p className="statusBadge">
              <span className="statusDot" aria-hidden="true" />
              Open to Applied AI and AI systems engineering roles
            </p>

            <p className="eyebrow">
              Applied AI / AI Systems Engineer
            </p>

            <h1>
              I build{" "}
              <span className="gradientText">AI systems you can use</span>
              , backed by public benchmarks.
            </h1>

            <ul className="heroKeywords" aria-label="Focus areas">
              <li>LLMs, AI Agents &amp; Multimodal AI</li>
              <li>RAG, Computer Vision &amp; Full-Stack AI</li>
              <li>Python, PyTorch &amp; React</li>
            </ul>

            <p className="heroDescription">
              Every project is deployed and open to try, and the newest ones
              publish their evaluation results, including where they fail.
            </p>

            <div className="heroActions">
              <a href="#projects" className="btn btnPrimary">
                View projects
              </a>
              <a href="#contact" className="btn btnGhost">
                Contact me
              </a>
              <a href={CV_URL} className="btn btnGhost" download>
                Download CV
                <span className="srOnly"> (PDF)</span>
              </a>
            </div>

            <SocialLinks variant="labeled" className="heroSocial" />

          </div>
          <HeroPortrait projectCount={featuredProjects.length} />
          </div>

          <dl className="statsBand">
            <div>
              <dd>{featuredProjects.length}</dd>
              <dt>Deployed projects</dt>
            </div>
            <div>
              <dd>{PUBLISHED_EVALUATIONS}</dd>
              <dt>Projects with published evaluations</dt>
            </div>
            <div>
              <dd className="statsText">CORD &middot; Spider &middot; SEC filings &middot; LibriSpeech &middot; PlantDoc &middot; OpenML</dd>
              <dt>Public benchmarks used</dt>
            </div>
            <div>
              <dd className="statsText">Agents &middot; RAG &middot; Vision</dd>
              <dt>Focus</dt>
            </div>
          </dl>
        </section>

        <section id="projects" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Selected work</p>
            <h2>Projects</h2>
            <p>
              AI systems taken from experimentation through to live
              deployment. Demos run on small servers that sleep when idle, so
              the first open can take up to a minute while one wakes; a short
              tour plays while you wait.
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

        <section id="background" className="section">
          <div className="sectionHeading">
            <p className="eyebrow">Background</p>
            <h2>Research and teaching, applied</h2>
            <p>
              Ten years of teaching and research in electronic and computer
              engineering, now focused on building and evaluating AI systems.
            </p>
          </div>

          <div className="bgGrid">
            {background.map((block) => (
              <div key={block.title} className="toolkitCard bgCard">
                <h3>{block.title}</h3>
                <ul>
                  {block.items.map((item) => (
                    <li key={item.head}>
                      <b>{item.head}</b>
                      {item.meta && <span className="bgMeta">{item.meta}</span>}
                      {item.text && <span className="bgText">{item.text}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="bgCv">
            <a href={CV_URL} className="btn btnPrimary" download>
              Download the full CV (PDF)
            </a>
          </p>
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
            <p className="eyebrow">Open to opportunities</p>
            <h2>Looking for an Applied AI engineer?</h2>
            <p>
              I am open to remote Applied AI and AI systems engineering
              roles: LLM agents, RAG, computer vision and full-stack AI
              products. If you have a problem like that, the projects above
              show how I work, and I would like to hear about it.
            </p>
            <ContactButton email={EMAIL} />
            <SocialLinks variant="labeled" className="contactSocial" />
            <p className="cvNote">
              <a href={CV_URL} download>Download my CV (PDF)</a>. Referees
              are available on request.
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
