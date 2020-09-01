import ChunkData from "./ChunkData";
import { Vector3 } from "three";

export interface FaceInfo {
  coord: [number, number, number];
  normal: number[];
  voxelNormal: Vector3;
}

export type MeshData = {
  vertices: number[];
  colors: number[];
  indices: number[];
  normals: number[];
  voxelIndexes: number[];
  voxelNormals: number[];
  voxelCount: number;
  faces: FaceInfo[];
  upFaces: number[];
  ao: number[];
};

export const meshChunk = (chunk: ChunkData, waterLevel: number): MeshData => {
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  const voxelIndexes: number[] = [];
  const size = chunk.size;
  const indexMap: { [key: string]: number } = {};
  const voxelNormals: number[] = [];
  const faces: FaceInfo[] = [];
  const upFaces: number[] = [];
  const ao: number[] = [];

  let voxelIndex = 0;
  let faceIndex = 0;

  for (let d = 0; d < 3; d++) {
    if (chunk.isWater && d != 1) {
      continue;
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          const a = getWorld(chunk, d, i, j, k);
          const b = getWorld(chunk, d, i + 1, j, k);

          if (a == null || b == null) {
            continue;
          }

          if (a > 0 === b > 0) {
            continue;
          }

          const front = a > 0;

          if (chunk.isWater && !front) {
            continue;
          }

          const i2 = i + 1;
          const v1 = getVector(d, i2, j, k);
          const v2 = getVector(d, i2, j + 1, k);
          const v3 = getVector(d, i2, j + 1, k + 1);
          const v4 = getVector(d, i2, j, k + 1);

          const index = vertices.length / 3;

          vertices.push(...v1, ...v2, ...v3, ...v4);

          const coord = front
            ? getVector(d, i, j, k)
            : getVector(d, i + 1, j, k);

          const color = chunk.getColorWorld(coord[0], coord[1], coord[2]);

          const absY = coord[1] + chunk.origin[1];

          if (!chunk.isWater && absY < waterLevel) {
            const factor = Math.pow(0.75, waterLevel - absY);
            color[0] *= factor;
            color[1] *= factor;
            color[2] *= factor;
          }

          colors.push(...color, ...color, ...color, ...color);

          if (front) {
            indices.push(
              index,
              index + 1,
              index + 2,
              index + 2,
              index + 3,
              index
            );
          } else {
            indices.push(
              index + 2,
              index + 1,
              index,
              index,
              index + 3,
              index + 2
            );
          }

          const normal = getFaceNormal(d, front);
          normals.push(...normal, ...normal, ...normal, ...normal);

          const key = getKey(coord[0], coord[1], coord[2]);

          // TODO optimize
          const voxelNormal = chunk.calcNormal(coord[0], coord[1], coord[2]);

          if (indexMap[key] == null) {
            indexMap[key] = voxelIndex;

            voxelNormals.push(voxelNormal.x, voxelNormal.y, voxelNormal.z);

            voxelIndex++;
          }

          const vi = indexMap[key];
          voxelIndexes.push(vi, vi, vi, vi);

          faces[faceIndex] = {
            coord,
            normal,
            voxelNormal,
          };

          if (d === 1 && front) {
            upFaces.push(faceIndex);
          }

          faceIndex++;

          var aoI = front ? i + 1 : i;
          var v00 = getWorld(chunk, d, aoI, j - 1, k - 1);
          var v01 = getWorld(chunk, d, aoI, j, k - 1);
          var v02 = getWorld(chunk, d, aoI, j + 1, k - 1);
          var v10 = getWorld(chunk, d, aoI, j - 1, k);
          var v12 = getWorld(chunk, d, aoI, j + 1, k);
          var v20 = getWorld(chunk, d, aoI, j - 1, k + 1);
          var v21 = getWorld(chunk, d, aoI, j, k + 1);
          var v22 = getWorld(chunk, d, aoI, j + 1, k + 1);

          ao.push(
            calcAo(v10, v01, v00),
            calcAo(v01, v12, v02),
            calcAo(v12, v21, v22),
            calcAo(v21, v10, v20)
          );
        }
      }
    }
  }

  return {
    vertices,
    colors,
    indices,
    normals,
    voxelIndexes,
    voxelNormals,
    voxelCount: voxelIndex,
    faces,
    upFaces,
    ao,
  };
};

const getKey = (i: number, j: number, k: number) => {
  return `${i}-${j}-${k}`;
};

const getVector = (
  d: number,
  i: number,
  j: number,
  k: number
): [number, number, number] => {
  if (d === 0) {
    return [i, j, k];
  } else if (d === 1) {
    return [k, i, j];
  }
  return [j, k, i];
};

const getWorld = (
  chunk: ChunkData,
  d: number,
  i: number,
  j: number,
  k: number
) => {
  if (d === 0) {
    return chunk.getWorld(i, j, k);
  } else if (d === 1) {
    return chunk.getWorld(k, i, j);
  }
  return chunk.getWorld(j, k, i);
};

const getFaceNormal = (d: number, front: boolean) => {
  const dir = front ? 1 : -1;
  if (d === 0) {
    return [dir, 0, 0];
  } else if (d === 1) {
    return [0, dir, 0];
  }
  return [0, 0, dir];
};

const calcAo = (s1F: number | null, s2F: number | null, cf: number | null) => {
  var s1 = s1F != null && s1F > 0;
  var s2 = s2F != null && s2F > 0;
  var c = cf != null && cf > 0;

  if (s1 && s2) {
    return 1.0;
  }

  var count = 0;
  if (s1) count++;
  if (s2) count++;
  if (c) count++;

  switch (count) {
    case 0:
      return 0.0;
    case 1:
      return 0.33;
    default:
      return 0.66;
  }
};
