type Vec3 = { x: number; y: number; z: number };

export function buildNeighborConnections(
  positions: Float32Array,
  count: number,
  maxDistance: number,
  maxNeighbors: number,
): Uint32Array {
  const cellSize = maxDistance;
  const buckets = new Map<string, number[]>();

  const key = (ix: number, iy: number, iz: number) => `${ix}|${iy}|${iz}`;

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const ix = Math.floor(x / cellSize);
    const iy = Math.floor(y / cellSize);
    const iz = Math.floor(z / cellSize);
    const k = key(ix, iy, iz);
    const bucket = buckets.get(k);
    if (bucket) bucket.push(i);
    else buckets.set(k, [i]);
  }

  const maxDistSq = maxDistance * maxDistance;
  const segments: number[] = [];

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const ix = Math.floor(x / cellSize);
    const iy = Math.floor(y / cellSize);
    const iz = Math.floor(z / cellSize);

    let added = 0;
    for (let dx = -1; dx <= 1 && added < maxNeighbors; dx++) {
      for (let dy = -1; dy <= 1 && added < maxNeighbors; dy++) {
        for (let dz = -1; dz <= 1 && added < maxNeighbors; dz++) {
          const bucket = buckets.get(key(ix + dx, iy + dy, iz + dz));
          if (!bucket) continue;
          for (const j of bucket) {
            if (j <= i || added >= maxNeighbors) continue;
            const ox = positions[j * 3] - x;
            const oy = positions[j * 3 + 1] - y;
            const oz = positions[j * 3 + 2] - z;
            const d2 = ox * ox + oy * oy + oz * oz;
            if (d2 <= maxDistSq) {
              segments.push(i, j);
              added++;
            }
          }
        }
      }
    }
  }

  return new Uint32Array(segments);
}

export function vec3ArrayFromFloat32(
  positions: Float32Array,
  count: number,
): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: positions[i * 3],
      y: positions[i * 3 + 1],
      z: positions[i * 3 + 2],
    });
  }
  return out;
}