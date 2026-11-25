"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { buildNeighborConnections } from "@/lib/spatial-hash";
import { sampleParticlesFromMoose } from "@/lib/sample-moose-particles";

type ParticleMooseProps = {
  className?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getParticleCount(): number {
  if (typeof window === "undefined") return 4000;
  return window.innerWidth < 768 ? 3500 : 9000;
}

export function ParticleMoose({ className }: ParticleMooseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let visible = true;
    let reducedMotion = prefersReducedMotion();
    const disposeList: Array<() => void> = [];

    const run = async () => {
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2") || probe.getContext("webgl");
        if (!gl) {
          setFallback(true);
          return;
        }

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        container.appendChild(renderer.domElement);

        disposeList.push(() => {
          renderer.dispose();
          renderer.domElement.remove();
        });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(0, 0.06, 3.35);

        const sculpture = new THREE.Group();
        scene.add(sculpture);

        const ktx2Loader = new KTX2Loader()
          .setTranscoderPath("/basis/")
          .detectSupport(renderer);
        await MeshoptDecoder.ready;

        const loader = new GLTFLoader();
        loader.setKTX2Loader(ktx2Loader);
        loader.setMeshoptDecoder(MeshoptDecoder);

        disposeList.push(() => ktx2Loader.dispose());

        const gltf = await loader.loadAsync("/models/moose.glb");
        if (disposed) return;

        const sample = sampleParticlesFromMoose(gltf.scene, getParticleCount());
        if (sample.debug) {
          console.info("Moose particle sample", sample.debug, {
            count: sample.count,
          });
        }
        const { positions, normals, count } = sample;
        const basePositions = new Float32Array(positions.slice(0, count * 3));

        const connectionPairs = buildNeighborConnections(
          basePositions,
          count,
          0.1,
          4,
        );

        const linePositions = new Float32Array(connectionPairs.length * 3);
        for (let i = 0; i < connectionPairs.length; i++) {
          const pi = connectionPairs[i];
          linePositions[i * 3] = basePositions[pi * 3];
          linePositions[i * 3 + 1] = basePositions[pi * 3 + 1];
          linePositions[i * 3 + 2] = basePositions[pi * 3 + 2];
        }

        const pointColors = new Float32Array(count * 3);
        const baseColor = new Float32Array(count * 3);
        const base = new THREE.Color("#35F18A");
        const highlight = new THREE.Color("#79FFA9");
        const dim = new THREE.Color("#1a9d5c");
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const c = t > 0.94 ? highlight : t > 0.15 ? base : dim;
          baseColor[i * 3] = c.r;
          baseColor[i * 3 + 1] = c.g;
          baseColor[i * 3 + 2] = c.b;
          pointColors[i * 3] = c.r;
          pointColors[i * 3 + 1] = c.g;
          pointColors[i * 3 + 2] = c.b;
        }

        const pointsGeom = new THREE.BufferGeometry();
        pointsGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(basePositions.slice(), 3),
        );
        pointsGeom.setAttribute(
          "normal",
          new THREE.BufferAttribute(normals.slice(0, count * 3), 3),
        );
        pointsGeom.setAttribute(
          "color",
          new THREE.BufferAttribute(pointColors, 3),
        );

        const pointsMat = new THREE.PointsMaterial({
          size: 0.022,
          vertexColors: true,
          transparent: true,
          opacity: 0.94,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        });
        sculpture.add(new THREE.Points(pointsGeom, pointsMat));

        const linesGeom = new THREE.BufferGeometry();
        linesGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(linePositions, 3),
        );
        const linesMat = new THREE.LineBasicMaterial({
          color: 0x35f18a,
          transparent: true,
          opacity: 0.11,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        sculpture.add(new THREE.LineSegments(linesGeom, linesMat));

        const ambientCount = Math.floor(count * 0.035);
        const ambientGeom = new THREE.BufferGeometry();
        const ambientPos = new Float32Array(ambientCount * 3);
        for (let i = 0; i < ambientCount; i++) {
          ambientPos[i * 3] = (Math.random() - 0.5) * 2.6;
          ambientPos[i * 3 + 1] = (Math.random() - 0.2) * 2.2;
          ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
        }
        ambientGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(ambientPos, 3),
        );
        const ambientMat = new THREE.PointsMaterial({
          color: 0x79ffa9,
          size: 0.005,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        scene.add(new THREE.Points(ambientGeom, ambientMat));

        disposeList.push(() => {
          pointsGeom.dispose();
          pointsMat.dispose();
          linesGeom.dispose();
          linesMat.dispose();
          ambientGeom.dispose();
          ambientMat.dispose();
          gltf.scene.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const mat = mesh.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          });
        });

        const resize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (w === 0 || h === 0) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);
        window.addEventListener("resize", resize);
        disposeList.push(() => {
          resizeObserver.disconnect();
          window.removeEventListener("resize", resize);
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
          },
          { threshold: 0.05 },
        );
        observer.observe(container);
        disposeList.push(() => observer.disconnect());

        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onMotion = () => {
          reducedMotion = motionMq.matches;
        };
        motionMq.addEventListener("change", onMotion);
        disposeList.push(() => motionMq.removeEventListener("change", onMotion));

        let targetX = 0;
        let targetY = 0;
        let parallaxX = 0;
        let parallaxY = 0;
        const onPointerMove = (e: PointerEvent) => {
          const rect = container.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.22;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -0.12;
        };
        const onPointerLeave = () => {
          targetX = 0;
          targetY = 0;
        };
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);
        disposeList.push(() => {
          container.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerleave", onPointerLeave);
        });

        const clock = new THREE.Clock();
        const rotationSpeed = (Math.PI * 2) / 30;
        const _view = new THREE.Vector3();

        let frameCounter = 0;
        const posAttr = pointsGeom.getAttribute("position") as THREE.BufferAttribute;
        const colAttr = pointsGeom.getAttribute("color") as THREE.BufferAttribute;

        const animate = () => {
          frameId = requestAnimationFrame(animate);
          if (!visible) return;

          const t = clock.getElapsedTime();
          if (!reducedMotion) {
            sculpture.rotation.y = t * rotationSpeed;
          }

          parallaxX += (targetX - parallaxX) * 0.06;
          parallaxY += (targetY - parallaxY) * 0.06;
          camera.position.set(parallaxX, 0.06 + parallaxY, 3.35);
          camera.lookAt(0, 0.06, 0);

          frameCounter++;
          if (!reducedMotion && frameCounter % 2 === 0) {
            _view.copy(camera.position).normalize();
            const rotY = sculpture.rotation.y;
            const cos = Math.cos(rotY);
            const sin = Math.sin(rotY);
            for (let i = 0; i < count; i++) {
              const nx = normals[i * 3];
              const ny = normals[i * 3 + 1];
              const nz = normals[i * 3 + 2];
              const rx = nx * cos + nz * sin;
              const rz = -nx * sin + nz * cos;
              const facing = Math.max(0, rx * _view.x + ny * _view.y + rz * _view.z);
              const pulse = 0.9 + Math.sin(t * 1.1 + i * 0.015) * 0.05;
              const bright = (0.5 + facing * 0.5) * pulse;
              colAttr.setXYZ(
                i,
                baseColor[i * 3] * bright,
                baseColor[i * 3 + 1] * bright,
                baseColor[i * 3 + 2] * bright,
              );

              if (i % 4 === 0) {
                posAttr.setXYZ(
                  i,
                  basePositions[i * 3] + Math.sin(t + i) * 0.0012,
                  basePositions[i * 3 + 1] + Math.cos(t * 0.7 + i) * 0.0008,
                  basePositions[i * 3 + 2],
                );
              }
            }
            colAttr.needsUpdate = true;
            posAttr.needsUpdate = true;
          }

          renderer.render(scene, camera);
        };

        setReady(true);
        animate();
        disposeList.push(() => cancelAnimationFrame(frameId));
      } catch (error) {
        console.error("ParticleMoose failed to initialize:", error);
        setFallback(true);
      }
    };

    void run();

    return () => {
      disposed = true;
      disposeList.forEach((fn) => fn());
    };
  }, []);

  if (fallback) {
    return (
      <div
        className={`flex items-center justify-center ${className ?? ""}`}
        role="img"
        aria-label="Stylized moose sculpture silhouette"
      >
        <div className="relative h-[min(100%,420px)] w-full max-w-md">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(53,241,138,0.35), transparent 65%)",
            }}
          />
          <svg
            viewBox="0 0 200 220"
            className="h-full w-full text-[#35F18A]"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          >
            <path d="M100 195 C78 195 65 175 62 150 C58 118 68 95 85 82 C72 62 45 38 32 22 C48 28 62 38 75 52 C82 35 95 18 118 12 C128 28 132 48 130 68 C148 58 168 48 178 42 C165 62 155 82 148 98 C165 108 175 128 178 152 C175 178 158 195 132 198 C118 200 108 198 100 195 Z" />
            <path d="M42 35 C28 28 18 22 12 18 M158 35 C172 28 182 22 188 18" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[280px] w-full md:min-h-[360px] ${className ?? ""}`}
      aria-hidden={!ready}
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Loading sculpture
          </p>
        </div>
      )}
    </div>
  );
}