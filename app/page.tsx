import ContactButton from "@/components/ContactButton";
import { projects } from "@/data/projects";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main>
      <Nav />

      <section className="hero">
        <div className="heroContent">
          <p className="eyebrow">AI ENGINEER | MACHINE LEARNING | COMPUTER VISION</p>

          <h1>
            I build practical AI systems that turn machine learning into useful,
            deployable applications.
          </h1>

          <p className="heroDescription">
            I design and develop intelligent applications across machine
            learning, computer vision, recommendation systems, and AI
            deployment.
          </p>

          <div className="heroActions">
            <a href="#projects" className="primaryButton">
              View Projects
            </a>

            <a href="#contact" className="secondaryButton">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="projectsSection">
        <div className="sectionHeading">
          <p className="eyebrow">SELECTED WORK</p>
          <h2>Projects</h2>
          <p>
            A selection of AI systems built from experimentation through
            deployment.
          </p>
        </div>

        <div className="projectsGrid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section id="about" className="aboutSection">
        <div className="sectionHeading">
          <p className="eyebrow">ABOUT</p>
          <h2>Engineering focused. AI driven.</h2>
          <p>
            I combine engineering experience with machine learning to build
            practical systems that solve real problems and can move beyond the
            notebook into usable applications.
          </p>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <div className="contactCard">
          <p className="eyebrow">LET'S WORK TOGETHER</p>
          <h2>Have an AI problem worth solving?</h2>
          <p>
            I am available for AI engineering, machine learning, computer
            vision, and AI application development opportunities.
          </p>
          <ContactButton email="mckelly2014@gmail.com" />
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Mc-Kelly Pepple. All rights reserved.</p>
      </footer>
    </main>
  );
}