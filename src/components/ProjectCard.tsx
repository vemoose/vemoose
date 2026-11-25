import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/config/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === "live" && project.url;

  const inner = (
    <>
      <div className="overflow-hidden rounded-[12px] bg-[#0c1010] p-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
          <Image
            src={project.artwork.src}
            alt={project.artwork.alt}
            fill
            className="object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.025]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-medium tracking-[-0.03em] text-primary">
            {project.name}
          </h3>
          <p className="mt-1.5 text-body text-secondary">{project.description}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {project.status === "live" ? "Live" : "In development"}
          </p>
        </div>
        {isLive && (
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-secondary transition-colors duration-[250ms] group-hover:border-accent-border group-hover:text-accent"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
      </div>
    </>
  );

  const className =
    "group block rounded-[18px] border border-border bg-surface p-5 transition-[transform,border-color] duration-[250ms] ease-out hover:-translate-y-[3px] hover:border-accent-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  if (isLive) {
    return (
      <a
        href={project.url}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <article className={className}>{inner}</article>;
}