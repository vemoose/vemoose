import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const _position = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _worldNormal = new THREE.Vector3();
const _normalMatrix = new THREE.Matrix3();

/** Lower body / legs removed — keep upper ~40% (head, antlers, neck). */
const HEAD_SLICE_FROM_BOTTOM = 0.6;

export type ParticleSampleSet = {
  positions: Float32Array;
  normals: Float32Array;
  count: number;
  debug?: {
    bboxMin: [number, number, number];
    bboxMax: [number, number, number];
    headMinY: number;
    headMaxY: number;
    upAxis: "x" | "y" | "z";
    headSliceFromBottom: number;
  };
};

function findMooseMesh(root: THREE.Object3D): THREE.SkinnedMesh | THREE.Mesh {
  let match: THREE.SkinnedMesh | THREE.Mesh | null = null;
  let fallback: THREE.SkinnedMesh | THREE.Mesh | null = null;

  root.traverse((child) => {
    const skinned = child as THREE.SkinnedMesh;
    if (skinned.isSkinnedMesh && skinned.geometry?.attributes?.position) {
      fallback ??= skinned;
      if (skinned.name === "moose") match = skinned;
      return;
    }
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry?.attributes?.position) {
      fallback ??= mesh;
      if (mesh.name === "moose") match = mesh;
    }
  });

  const chosen = match ?? fallback;
  if (!chosen) {
    throw new Error("No moose mesh found in GLB");
  }
  return chosen;
}

function bakeMooseGeometry(mesh: THREE.Mesh | THREE.SkinnedMesh): THREE.BufferGeometry {
  mesh.updateMatrixWorld(true);
  const geometry = mesh.geometry.clone();
  geometry.applyMatrix4(mesh.matrixWorld);
  geometry.deleteAttribute("skinIndex");
  geometry.deleteAttribute("skinWeight");
  geometry.computeVertexNormals();
  return geometry;
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

function headHeightBounds(
  geometry: THREE.BufferGeometry,
): { upAxis: "x" | "y" | "z"; headMin: number; headMax: number } {
  const box = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const upAxis = detectUpAxis(box);
  const minAlong = axisValue(box.min, upAxis);
  const maxAlong = axisValue(box.max, upAxis);
  const range = maxAlong - minAlong;
  return {
    upAxis,
    headMin: minAlong + range * HEAD_SLICE_FROM_BOTTOM,
    headMax: maxAlong - range * 0.02,
  };
}

function centerOnHeadBand(
  geometry: THREE.BufferGeometry,
  upAxis: "x" | "y" | "z",
  headMin: number,
  headMax: number,
): void {
  const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
  const center = new THREE.Vector3();
  let count = 0;

  for (let i = 0; i < attr.count; i++) {
    _position.fromBufferAttribute(attr, i);
    const along = axisValue(_position, upAxis);
    if (along < headMin || along > headMax) continue;
    center.add(_position);
    count += 1;
  }

  if (count === 0) return;
  center.divideScalar(count);
  geometry.translate(-center.x, -center.y, -center.z);
}

function isHeadSurfacePoint(p: THREE.Vector3, headMin: number, headMax: number): boolean {
  const y = p.y;
  if (y < headMin || y > headMax) return false;

  const radial = Math.hypot(p.x, p.z);
  const span = Math.max(headMax - headMin, 1e-6);
  const along = (y - headMin) / span;

  // Cut neck stump / interior spine cylinder visible on rear-facing bind pose.
  if (along < 0.42 && radial < 0.22) return false;
  if (radial < 0.09 && along > 0.28 && along < 0.88) return false;

  return true;
}

function prepareHeadGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const box = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const fullCenter = box.getCenter(new THREE.Vector3());
  geometry.translate(-fullCenter.x, -fullCenter.y, -fullCenter.z);

  const sized = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );
  const scale = 2.35 / Math.max(...sized.getSize(new THREE.Vector3()).toArray());
  geometry.scale(scale, scale, scale);

  const { upAxis, headMin, headMax } = headHeightBounds(geometry);
  if (upAxis !== "y") {
    // Tevy moose is Y-up; other axes would need a different slice — keep Y for filter helpers.
  }

  centerOnHeadBand(geometry, upAxis, headMin, headMax);
  geometry.computeVertexNormals();
  return geometry;
}

export function sampleParticlesFromMoose(
  root: THREE.Object3D,
  targetCount: number,
): ParticleSampleSet {
  const mooseMesh = findMooseMesh(root);
  const geometry = prepareHeadGeometry(bakeMooseGeometry(mooseMesh));
  const { headMin, headMax, upAxis } = headHeightBounds(geometry);
  const boundsBox = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute("position") as THREE.BufferAttribute,
  );

  const mesh = new THREE.Mesh(geometry);
  mesh.rotation.y = Math.PI;
  mesh.updateMatrixWorld(true);
  _normalMatrix.getNormalMatrix(mesh.matrixWorld);

  const sampler = new MeshSurfaceSampler(mesh).build();
  const positions = new Float32Array(targetCount * 3);
  const normals = new Float32Array(targetCount * 3);
  let written = 0;
  let attempts = 0;
  const maxAttempts = targetCount * 120;

  while (written < targetCount && attempts < maxAttempts) {
    attempts += 1;
    sampler.sample(_position, _normal);
    if (!isHeadSurfacePoint(_position, headMin, headMax)) continue;

    const worldPos = _position.clone().applyMatrix4(mesh.matrixWorld);
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
  if (mesh.material instanceof THREE.Material) mesh.material.dispose();

  if (written < Math.min(500, targetCount * 0.05)) {
    throw new Error(
      `Moose particle sampling produced too few points (${written}/${targetCount}); headY=[${headMin.toFixed(3)},${headMax.toFixed(3)}]`,
    );
  }

  return {
    positions,
    normals,
    count: written,
    debug: {
      bboxMin: boundsBox.min.toArray() as [number, number, number],
      bboxMax: boundsBox.max.toArray() as [number, number, number],
      headMinY: headMin,
      headMaxY: headMax,
      upAxis,
      headSliceFromBottom: HEAD_SLICE_FROM_BOTTOM,
    },
  };
}