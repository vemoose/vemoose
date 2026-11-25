"use client";

import { useEffect, useRef, useState } from "react";
import { MooseArtPlaceholder } from "@/components/MooseArtPlaceholder";
import { mountMoose } from "@/lib/moose/moose-renderer.js";

export default function ParticleMoose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = mountMoose(canvas, {
      period: 28,
    });

    const timeout = window.setTimeout(() => setReady(true), 220);

    return () => {
      window.clearTimeout(timeout);
      cleanup();
    };
  }, []);

  return (
    <div className="particle-moose">
      {showPlaceholder && (
        <MooseArtPlaceholder
          fading={ready}
          showLabel={!ready}
          onFaded={() => setShowPlaceholder(false)}
        />
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating emerald particle sculpture of a moose head"
        className={`particle-moose-canvas${ready ? " is-ready" : ""}`}
      />
    </div>
  );
}