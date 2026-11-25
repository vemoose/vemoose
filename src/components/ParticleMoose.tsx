"use client";

import { useEffect, useRef } from "react";
import { mountMoose } from "@/lib/moose/moose-renderer.js";

export default function ParticleMoose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = mountMoose(canvas, {
      period: 28,
    });

    return cleanup;
  }, []);

  return (
    <div className="particle-moose">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating emerald particle sculpture of a moose head"
        className="particle-moose-canvas"
      />
    </div>
  );
}