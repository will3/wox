import ChunksData from "./ChunksData";
import { Vector3, BufferGeometry, Mesh } from "three";
import _ from "lodash";
import { MeshData } from "./meshChunk";

export type Color = [number, number, number];

export default class ChunkData {
  data: number[] = [];
  color: Color[] = [];
  origin: [number, number, number];
  size: number;
  chunks: ChunksData;
  meshData: MeshData | null = null;
  dirty = false;
  version = 1;
  key: string;
  mesh: Mesh = new Mesh();

  constructor(
    origin: [number, number, number],
    chunks: ChunksData,
    size: number
  ) {
    this.origin = origin;
    this.size = size;
    this.chunks = chunks;
    this.key = this.getKey();
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

  getWorld(i: number, j: number, k: number): number | null {
    if (
      i < 0 ||
      j < 0 ||
      k < 0 ||
      i >= this.size ||
      j >= this.size ||
      k >= this.size
    ) {
      return this.chunks.get(
        i + this.origin[0],
        j + this.origin[1],
        k + this.origin[2]
      );
    }

    return this.get(i, j, k);
  }

  set(i: number, j: number, k: number, v: number) {
    const index = i * this.size * this.size + j * this.size + k;
    this.data[index] = v;
    this.dirty = true;
  }

  setColor(i: number, j: number, k: number, color: Color) {
    const index = i * this.size * this.size + j * this.size + k;
    this.color[index] = color;
  }

  getColor(i: number, j: number, k: number) {
    const index = i * this.size * this.size + j * this.size + k;
    const color = this.color[index];
    if (color == null) {
      return [0, 0, 0];
    }
    return _.clone(color);
  }

  getColorWorld(i: number, j: number, k: number) {
    if (
      i < 0 ||
      j < 0 ||
      k < 0 ||
      i >= this.size ||
      j >= this.size ||
      k >= this.size
    ) {
      return this.chunks.getColor(
        i + this.origin[0],
        j + this.origin[1],
        k + this.origin[2]
      );
    }

    return this.getColor(i, j, k);
  }

  private getKey() {
    return this.origin.join(",");
  }

  calcNormal(i: number, j: number, k: number) {
    return new Vector3(
      this.getWorld(i + 1, j, k)! - this.getWorld(i - 1, j, k)!,
      this.getWorld(i, j + 1, k)! - this.getWorld(i, j - 1, k)!,
      this.getWorld(i, j, k + 1)! - this.getWorld(i, j, k - 1)!
    ).normalize();
  }
}
