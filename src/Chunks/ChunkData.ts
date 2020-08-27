import MeshData from "./MeshData";
import ChunksData from "./ChunksData";

export type Color = [number, number, number];

export default class ChunkData {
  data: number[] = [];
  color: Color[] = [];
  origin: [number, number, number];
  size = 32;
  chunks: ChunksData;

  constructor(origin: [number, number, number], chunks: ChunksData, size = 32) {
    this.origin = origin;
    this.size = size;
    this.chunks = chunks;
  }

  mesh(): MeshData {
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];

    for (let d = 0; d < 3; d++) {
      for (let i = -1; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          for (let k = 0; k < this.size; k++) {
            const a = this.getInDimension(d, i, j, k);
            const b = this.getInDimension(d, i + 1, j, k);

            if (a > 0 === b > 0) {
              continue;
            }

            const front = a > 0;

            const i2 = i + 1;
            const v1 = this.getVector(d, i2, j, k);
            const v2 = this.getVector(d, i2, j + 1, k);
            const v3 = this.getVector(d, i2, j + 1, k + 1);
            const v4 = this.getVector(d, i2, j, k + 1);

            const index = vertices.length / 3;

            vertices.push(...v1, ...v2, ...v3, ...v4);

            const ci = front ? i : i + 1;
            const coord = this.getVector(d, ci, j, k);

            const color = this.getColor(coord[0], coord[1], coord[2]);
            colors.push(...color, ...color, ...color, ...color);
            const normal = this.getNormal(d, front);

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

            normals.push(...normal, ...normal, ...normal, ...normal);
          }
        }
      }
    }

    return {
      vertices,
      colors,
      indices,
      normals,
    };
  }

  getVector(d: number, i: number, j: number, k: number) {
    if (d === 0) {
      return [i, j, k];
    } else if (d === 1) {
      return [k, i, j];
    }
    return [j, k, i];
  }

  getInDimension(d: number, i: number, j: number, k: number) {
    if (i >= this.size) {
      return 0;
    }
    if (d === 0) {
      return this.get(i, j, k);
    } else if (d === 1) {
      return this.get(k, i, j);
    }
    return this.get(j, k, i);
  }

  get(i: number, j: number, k: number): number {
    if (
      i < 0 ||
      j < 0 ||
      k < 0 ||
      i >= this.size ||
      j >= this.size ||
      k >= this.size
    ) {
      return 0;
    }
    const index = i * this.size * this.size + j * this.size + k;
    return this.data[index] || 0;
  }

  set(i: number, j: number, k: number, v: number) {
    const index = i * this.size * this.size + j * this.size + k;
    this.data[index] = v;
  }

  setColor(i: number, j: number, k: number, color: Color) {
    const index = i * this.size * this.size + j * this.size + k;
    this.color[index] = color;
  }

  getColor(i: number, j: number, k: number) {
    const index = i * this.size * this.size + j * this.size + k;
    return this.color[index];
  }

  getNormal(d: number, front: boolean) {
    const dir = front ? 1 : -1;
    if (d === 0) {
      return [dir, 0, 0];
    } else if (d === 1) {
      return [0, dir, 0];
    }
    return [0, 0, dir];
  }

  getKey() {
    return this.origin.join(",");
  }
}
