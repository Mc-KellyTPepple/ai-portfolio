import { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="projectCard">
      <div className="projectCardHeader">
        <span className="projectYear">{project.year}</span>
      </div>

      <h3 className="projectTitle">{project.title}</h3>
      <p className="projectTagline">{project.tagline}</p>
      <p className="projectDescription">{project.description}</p>

      <div className="projectTags">
        {project.tags.map((tag) => (
          <span key={tag} className="projectTag">
            {tag}
          </span>
        ))}
      </div>

      <a href={project.url} target="_blank" rel="noopener noreferrer" className="projectLink">
        View Live Project
      </a>
    </div>
  );
}