import { Suspense } from "react";
import { ArrowUp } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { CopyrightYear } from "@/components/CopyrightYear";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border py-10" id="site-footer">
      <MotionReveal>
        <div className="mx-auto flex max-w-content flex-col gap-6 px-gutter sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] tracking-[-0.02em] text-primary">
              vemoose<span className="text-accent">.</span>
            </p>
            <p className="mt-1 text-[14px] text-muted">
              ©{" "}
              <Suspense fallback={2026}>
                <CopyrightYear />
              </Suspense>{" "}
              Vemoose
            </p>
          </div>
          <a
            href="#top"
            className="text-link self-start px-2 py-1.5 text-[14px] text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:self-auto"
          >
            Back to top
            <ArrowUp className="text-link__icon h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </MotionReveal>
    </footer>
  );
}