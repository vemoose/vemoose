"use client";

import dynamic from "next/dynamic";
import { MooseArtPlaceholder } from "@/components/MooseArtPlaceholder";

const ParticleMoose = dynamic(() => import("@/components/ParticleMoose"), {
  ssr: false,
  loading: () => (
    <div className="particle-moose particle-moose--loading" aria-hidden="true">
      <MooseArtPlaceholder />
    </div>
  ),
});

export function MooseSculptureLazy() {
  return <ParticleMoose />;
}