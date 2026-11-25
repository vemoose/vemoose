import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const _position = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _worldNormal = new THREE.Vector3();
const _normalMatrix = new THREE.Matrix3();

export type ParticleSampleSet = {
  positions: Float32Array;
  normals: Float32Array;
  count: number;
  debug?: {
    bboxMin: [number, number, number];
    bboxMax: [number, number, number];
    bustMinY: number;
    upAxis: "x" | "y" | "z";
    bustFractionFromBottom: number;
  };
};

function pickNamedMesh(root: THREE.Object3D): THREE.Mesh | THREE.SkinnedMesh | null {
  let named: THREE.Mesh | THREE.SkinnedMesh | null = null;
  let any: THREE.Mesh | THREE.SkinnedMesh | null = null;

  root.traverse((child) => {
    const skinned = child as THREE.SkinnedMesh;
    const mesh = child as THREE.Mesh;
    const isSkinned = skinned.isSkinnedMesh;
    const isMesh = mesh.isMesh && !isSkinned;
    if (!isSkinned && !isMesh) return;
    if (!mesh.geometry?.attributes?.position) return;

    const candidate = (isSkinned ? skinned : mesh) as THREE.Mesh | THREE.SkinnedMesh;
    any ??= candidate;
    if (candidate.name === "moose") named = candidate;
  });

  return named ?? any;
}

function buildMergedWorldGeometry(root: THREE.Object3D): THREE.BufferGeometry {
  root.updateMatrixWorld(true);
  const parts: THREE.BufferGeometry[] = [];

  root.traverse((child) => {
    const skinned = child as THREE.SkinnedMesh;
    const mesh = child as THREE.Mesh;
    const isSkinned = skinned.isSkinnedMesh;
    const isMesh = mesh.isMesh && !isSkinned;
    if (!isSkinned && !isMesh) return;

    const source = (isSkinned ? skinned.geometry : mesh.geometry) as THREE.BufferGeometry;
    if (!source?.attributes?.position) return;

    const geom = source.clone();
    geom.applyMatrix4(child.matrixWorld);
    geom.deleteAttribute("skinIndex");
    geom.deleteAttribute("skinWeight");
    parts.push(geom);
  });

  if (parts.length === 0) {
    throw new Error("No mesh geometry found in moose GLB");
  }

  const merged =
    parts.length === 1 ? parts[0] : mergeGeometries(parts, false);
  if (!merged) {
    throw new Error("Failed to merge moose mesh geometries");
  }
  merged.computeVertexNormals();
  return merged;
}

function detectUpAxis(box: THREE.Box3): "x" | "y" | "z" {
  const size = box.getSize(new THREE.Vector3());
  if (size.y >= size.x && size.y >= size.z) return "y";
  if (size.z >= size.x && size.z >= size.y) return "z";
  return "x";
}

function axisValue(v: THREE.Vector3, axis: "x" | "y" | "z"): number {
  return axis === "x" ? v.x : axis === "y" ? v.y : v.z;
}

function centerAndScaleGeometry(geometry: THREE.BufferGeometry): {
  bustMinAlongUp: number;
  upAxis: "x" | "y" | "z";
  bustFractionFromBottom: number;
  bboxMin: THREE.Vector3;
  bboxMax: THREE.Vector3;
} {
  const bustFractionFromBottom = 0.28;
  const box = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const center = box.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z);

  const sized = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const size = sized.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.2 / maxDim;
  geometry.scale(scale, scale, scale);

  const scaled = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const upAxis = detectUpAxis(scaled);
  const minAlongUp = axisValue(scaled.min, upAxis);
  const maxAlongUp = axisValue(scaled.max, upAxis);
  const range = maxAlongUp - minAlongUp;
  const bustMinAlongUp = minAlongUp + range * bustFractionFromBottom;

  return {
    bustMinAlongUp,
    upAxis,
    bustFractionFromBottom,
    bboxMin: scaled.min.clone(),
    bboxMax: scaled.max.clone(),
  };
}

export function sampleParticlesFromMoose(
  root: THREE.Object3D,
  targetCount: number,
): ParticleSampleSet {
  pickNamedMesh(root);

  const geometry = buildMergedWorldGeometry(root);
  const {
    bustMinAlongUp,
    upAxis,
    bustFractionFromBottom,
    bboxMin,
    bboxMax,
  } = centerAndScaleGeometry(geometry);

  const mesh = new THREE.Mesh(geometry);
  mesh.rotation.y = Math.PI * 0.06;
  mesh.updateMatrixWorld(true);
  _normalMatrix.getNormalMatrix(mesh.matrixWorld);

  const sampler = new MeshSurfaceSampler(mesh).build();
  const positions = new Float32Array(targetCount * 3);
  const normals = new Float32Array(targetCount * 3);
  let written = 0;
  let attempts = 0;
  const maxAttempts = targetCount * 80;

  while (written < targetCount && attempts < maxAttempts) {
    attempts += 1;
    sampler.sample(_position, _normal);

    const worldPos = _position.clone().applyMatrix4(mesh.matrixWorld);
    const alongUp = axisValue(worldPos, upAxis);
    if (alongUp < bustMinAlongUp) continue;

    _worldNormal.copy(_normal).applyMatrix3(_normalMatrix).normalize();

    positions[written * 3] = worldPos.x;
    positions[written * 3 + 1] = worldPos.y;
    positions[written * 3 + 2] = worldPos.z;
    normals[written * 3] = _worldNormal.x;
    normals[written * 3 + 1] = _worldNormal.y;
    normals[written * 3 + 2] = _worldNormal.z;
    written += 1;
  }

  geometry.dispose();
  const mat = mesh.material;
  if (mat instanceof THREE.Material) mat.dispose();

  if (written < Math.min(500, targetCount * 0.05)) {
    throw new Error(
      `Moose particle sampling produced too few points (${written}/${targetCount}); up=${upAxis} bustMin=${bustMinAlongUp.toFixed(3)} bboxY=[${bboxMin.y.toFixed(3)},${bboxMax.y.toFixed(3)}]`,
    );
  }

  return {
    positions,
    normals,
    count: written,
    debug: {
      bboxMin: bboxMin.toArray() as [number, number, number],
      bboxMax: bboxMax.toArray() as [number, number, number],
      bustMinY: bustMinAlongUp,
      upAxis,
      bustFractionFromBottom,
    },
  };
}