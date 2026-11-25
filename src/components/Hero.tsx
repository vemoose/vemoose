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

      <div className="relative min-h-[500px] p-hero">
        <div className="grid min-h-[inherit] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8 lg:gap-10">
          <div className="flex max-w-md flex-col gap-8 self-center md:max-w-none md:pr-4">
            <HeroCopy />
          </div>

          <div className="relative flex w-full min-h-[320px] items-center justify-center md:min-h-[420px]">
            <MooseSculptureLazy className="absolute inset-0 h-full min-h-[320px] w-full md:min-h-[420px]" />
          </div>
        </div>

        <HeroFooterNotes />
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        Independent product studio
      </p>
      <h1 id="hero-heading" className="hero-heading text-primary">
        Ideas into
        <br />
        <span className="text-accent">existence.</span>
      </h1>
      <p className="max-w-sm text-body text-secondary">
        Digital products, useful tools, and experiments born from curiosity.
      </p>
      <a
        href="#projects"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-[#04140b] transition-colors hover:bg-accent-hover"
      >
        Discover the work
        <ArrowDownRight className="h-4 w-4" strokeWidth={2} />
      </a>
    </>
  );
}

function HeroFooterNotes() {
  return (
    <div className="mt-6 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:absolute md:bottom-6 md:left-[var(--spacing-hero)] md:right-[var(--spacing-hero)] md:mt-0">
      <span>Always building / Est. 2026</span>
      <span>Fig. 01 — Living form</span>
    </div>
  );
}