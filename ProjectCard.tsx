import { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  /** Renders the card as a wide, two-column feature card */
  featured?: boolean;
};

export default function ProjectCard({
  project,
  index,
  featured = false,
}: ProjectCardProps) {
  return (
    <article
      className={`projectCard ${featured ? "projectCardFeatured" : ""}`}
      data-accent={project.accent}
    >
      <div className="projectMain">
        <div className="projectCardHeader">
          <span className="projectCategory">
            <span className="projectDot" aria-hidden="true" />
            {project.category}
          </span>
          <span className="projectMeta">
            {String(index + 1).padStart(2, "0")} &middot; {project.year}
          </span>
        </div>

        <h3 className="projectTitle">{project.title}</h3>
        <p className="projectTagline">{project.tagline}</p>
        <p className="projectDescription">{project.description}</p>
      </div>

      <div className="projectSide">
        <ul className="projectTags" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="projectTag">
              {tag}
            </li>
          ))}
        </ul>

        <div className="projectActions">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="projectCta"
        >
          <span className="projectCtaGlow" aria-hidden="true" />
          <span className="projectCtaInner">
            <span>{project.cta}</span>
            <svg
              className="projectCtaArrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
          <span className="srOnly"> (opens in a new tab)</span>
        </a>

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="sourceLink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            Source
            <span className="srOnly"> code on GitHub (opens in a new tab)</span>
          </a>
        )}
        </div>
      </div>
    </article>
  );
}
