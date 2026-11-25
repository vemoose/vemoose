import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const _position = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _worldNormal = new THREE.Vector3();
const _normalMatrix = new THREE.Matrix3();

export type ParticleSampleSet = {
  positions: Float32Array;
  normals: Float32Array;
  count: number;
};

function normalizeMooseRoot(root: THREE.Object3D): { bustMinY: number } {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.2 / maxDim;
  root.scale.setScalar(scale);
  root.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledSize = scaledBox.getSize(new THREE.Vector3());
  const bustMinY = scaledBox.min.y + scaledSize.y * 0.4;
  root.rotation.y = Math.PI * 0.06;
  root.updateMatrixWorld(true);

  return { bustMinY };
}

export function sampleParticlesFromMoose(
  root: THREE.Object3D,
  targetCount: number,
): ParticleSampleSet {
  const { bustMinY } = normalizeMooseRoot(root);
  const meshes: THREE.Mesh[] = [];
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry?.attributes?.position) meshes.push(mesh);
    }
  });

  if (meshes.length === 0) {
    throw new Error("No mesh geometry found in moose GLB");
  }

  const positions = new Float32Array(targetCount * 3);
  const normals = new Float32Array(targetCount * 3);
  let written = 0;
  const maxAttempts = targetCount * 50;
  for (const mesh of meshes) {
    mesh.updateMatrixWorld(true);
    _normalMatrix.getNormalMatrix(mesh.matrixWorld);
    const sampler = new MeshSurfaceSampler(mesh).build();
    let attempts = 0;

    while (written < targetCount && attempts < maxAttempts) {
      attempts++;
      sampler.sample(_position, _normal);

      const worldPos = _position.clone().applyMatrix4(mesh.matrixWorld);
      if (worldPos.y < bustMinY) continue;

      _worldNormal.copy(_normal).applyMatrix3(_normalMatrix).normalize();

      positions[written * 3] = worldPos.x;
      positions[written * 3 + 1] = worldPos.y;
      positions[written * 3 + 2] = worldPos.z;
      normals[written * 3] = _worldNormal.x;
      normals[written * 3 + 1] = _worldNormal.y;
      normals[written * 3 + 2] = _worldNormal.z;
      written++;
    }
    if (written >= targetCount) break;
  }

  return { positions, normals, count: written };
}