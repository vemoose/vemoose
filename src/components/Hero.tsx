import { ArrowDownRight } from "lucide-react";
import { MotionEnter } from "@/components/MotionEnter";
import { MooseSculptureLazy } from "@/components/MooseSculptureLazy";

export function Hero() {
  return (
    <section
      className="hero-panel relative overflow-hidden rounded-[24px] border border-border bg-hero"
      aria-labelledby="hero-heading"
    >
      <div
        className="hero-panel__glow pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div className="hero-panel__sheen pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-panel__veil pointer-events-none absolute inset-0" aria-hidden />

      <div className="hero-panel__inner relative min-h-[500px] p-hero">
        <div className="grid min-h-[inherit] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8 lg:gap-10">
          <div className="flex max-w-md flex-col gap-8 self-center md:max-w-none md:pr-4">
            <HeroCopy />
          </div>

          <MotionEnter className="hero-art min-w-0" delay={720} variant="hero">
            <MooseSculptureLazy />
          </MotionEnter>
        </div>

        <HeroFooterNotes />
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <>
      <MotionEnter delay={260} variant="hero">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Independent product studio
        </p>
      </MotionEnter>
      <MotionEnter delay={420} variant="hero">
        <h1 id="hero-heading" className="hero-heading text-primary">
          Ideas into
          <br />
          <span className="hero-heading__accent text-accent">existence.</span>
        </h1>
      </MotionEnter>
      <MotionEnter delay={580} variant="hero">
        <p className="max-w-sm text-body text-secondary">
          Digital products, useful tools, and experiments born from curiosity.
        </p>
      </MotionEnter>
      <MotionEnter delay={760} variant="hero">
        <a href="#projects" className="cta-primary">
          Discover the work
          <ArrowDownRight
            className="cta-primary__icon h-4 w-4"
            strokeWidth={2}
          />
        </a>
      </MotionEnter>
    </>
  );
}

function HeroFooterNotes() {
  return (
    <MotionEnter delay={940} variant="hero">
      <div className="mt-6 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:absolute md:bottom-6 md:left-[var(--spacing-hero)] md:right-[var(--spacing-hero)] md:mt-0">
        <span>Always building / Est. 2026</span>
        <span>Fig. 01 — Living form</span>
      </div>
    </MotionEnter>
  );
}