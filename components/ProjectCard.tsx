import { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const isLightFace =
    project.slug === "lightface-ai" ||
    project.url.includes("lightface-hybrid-ai");

  const isHabitTracker =
    project.slug === "habit-tracker" ||
    project.url.includes("habit-tracker");

  const isTalentMatch =
    project.slug === "talent-match-ai" ||
    project.url.includes("talentmatch-ai") ||
    project.url.includes("talent-match-ai");

  // Enable animation for featured AI and full-stack projects
  const isAnimated = isLightFace || isHabitTracker || isTalentMatch;

  // Custom button labels based on project type
  const getButtonLabel = () => {
    if (isTalentMatch) return "Try Talent Match AI";
    if (isHabitTracker) return "View Habit Tracker API";
    if (isLightFace) return "Try LightFace AI";
    return "View Live Project";
  };

  return (
    <div
      className={`projectCard ${isLightFace ? "lightfaceCard" : ""} ${
        isHabitTracker ? "habitTrackerCard" : ""
      } ${isTalentMatch ? "talentMatchCard" : ""}`}
    >
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

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={isAnimated ? "animatedProjectLink" : "projectLink"}
      >
        {isAnimated ? (
          <>
            <span className="animatedGlow" />
            <span className="animatedText">
              <span>{getButtonLabel()}</span>
              <svg
                className="animatedArrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </>
        ) : (
          "View Live Project"
        )}
      </a>
    </div>
  );
}
