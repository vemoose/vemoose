import { projects } from "@/config/projects";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 py-section"
      aria-labelledby="projects-heading"
    >
      <MotionReveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          01 / Projects
        </p>
        <h2 id="projects-heading" className="section-heading mt-3 text-primary">
          Made to exist.
        </h2>
        <p className="mt-3 max-w-lg text-body text-secondary">
          A growing collection of independent products.
        </p>
      </MotionReveal>

      <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <MotionReveal delay={80 + index * 90}>
              <ProjectCard project={project} />
            </MotionReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}