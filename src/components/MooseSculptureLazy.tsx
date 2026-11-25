"use client";

import dynamic from "next/dynamic";

const ParticleMoose = dynamic(
  () =>
    import("@/components/ParticleMoose").then((m) => ({
      default: m.ParticleMoose,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] w-full items-center justify-center md:min-h-[360px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Loading sculpture
        </p>
      </div>
    ),
  },
);

export function MooseSculptureLazy({ className }: { className?: string }) {
  return <ParticleMoose className={className} />;
}