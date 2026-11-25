"use client";

import dynamic from "next/dynamic";

const ParticleMoose = dynamic(() => import("@/components/ParticleMoose"), {
  ssr: false,
  loading: () => <div className="particle-moose" aria-hidden="true" />,
});

export function MooseSculptureLazy() {
  return <ParticleMoose />;
}