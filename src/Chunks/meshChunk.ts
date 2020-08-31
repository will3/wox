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
};

export const meshChunk = (chunk: ChunkData): MeshData => {
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

  let voxelIndex = 0;
  let faceIndex = 0;

  for (let d = 0; d < 3; d++) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          const a = getInDimension(chunk, d, i, j, k);
          const b = getInDimension(chunk, d, i + 1, j, k);

          if (a == null || b == null) {
            continue;
          }

          if (a > 0 === b > 0) {
            continue;
          }

          const front = a > 0;

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

const getInDimension = (
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
