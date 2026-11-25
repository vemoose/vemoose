import { projects } from "@/config/projects";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 py-section" aria-labelledby="projects-heading">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        01 / Projects
      </p>
      <h2 id="projects-heading" className="section-heading mt-3 text-primary">
        Made to exist.
      </h2>
      <p className="mt-3 max-w-lg text-body text-secondary">
        A growing collection of independent products.
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}