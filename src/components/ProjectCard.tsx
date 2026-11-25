import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/config/projects";

type ProjectCardProps = {
  project: Project;
};

const shellClassName =
  "project-card group flex min-h-[168px] flex-col justify-between rounded-[18px] border border-border bg-surface p-6";

export function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === "live" && project.url;
  const statusLabel = project.status === "live" ? "Live" : "In development";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors duration-[280ms] ease-out group-hover:text-secondary">
          {project.category}
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors duration-[280ms] ease-out group-hover:text-secondary">
          {statusLabel}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[22px] font-medium tracking-[-0.03em] text-primary transition-colors duration-[280ms] ease-out group-hover:text-[#fafdfa]">
            {project.name}
          </h3>
          <p className="mt-2 text-body text-secondary transition-colors duration-[280ms] ease-out group-hover:text-primary/80">
            {project.description}
          </p>
        </div>
        {isLive && (
          <span
            className="project-card__icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-secondary"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
      </div>
    </>
  );

  if (isLive) {
    return (
      <a
        href={project.url}
        className={shellClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <article className={shellClassName}>{inner}</article>;
}