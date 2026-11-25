import { ArrowDownRight } from "lucide-react";
import { MooseSculptureLazy } from "@/components/MooseSculptureLazy";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden rounded-[24px] border border-border bg-hero"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 78% 50%, rgba(53,241,138,0.12), transparent 58%)",
        }}
      />

      <div className="relative grid min-h-[500px] grid-cols-1 items-stretch gap-8 p-hero md:grid-cols-[46%_54%] md:gap-4">
        <div className="flex flex-col justify-between gap-10 py-1 md:py-0">
          <div className="max-w-md">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Independent product studio
            </p>
            <h1
              id="hero-heading"
              className="hero-heading text-primary"
            >
              Ideas into
              <br />
              <span className="text-accent">existence.</span>
            </h1>
            <p className="mt-5 max-w-sm text-body text-secondary">
              Digital products, useful tools, and experiments born from
              curiosity.
            </p>
            <a
              href="#projects"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-[#04140b] transition-colors hover:bg-accent-hover"
            >
              Discover the work
              <ArrowDownRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

        </div>

        <div className="relative flex min-h-[300px] items-center justify-center md:min-h-0">
          <MooseSculptureLazy className="h-full min-h-[300px] w-full md:min-h-[400px]" />
        </div>

        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:col-span-2 md:absolute md:bottom-6 md:left-[56px] md:right-[56px]">
          <span>Always building / Est. 2026</span>
          <span>Fig. 01 — Living form</span>
        </div>
      </div>
    </section>
  );
}