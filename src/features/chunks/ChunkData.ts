import ChunksData from "./ChunksData";
import { MeshData } from "./MeshData";
import { nanoid } from "nanoid";
import { Color } from "three";

type getValueFunction = (i: number, j: number, k: number) => number | null;

export default class ChunkData {
  id = nanoid();
  data: number[] = [];
  color: Color[] = [];
  origin: [number, number, number];
  size: number;
  chunks: ChunksData;
  meshData: MeshData | null = null;
  dirty = false;
  key: string;
  layer: number;
  isWater = false;
  getValueCallback: getValueFunction;
  defaultColor = new Color(0, 0, 0);

  constructor(
    origin: [number, number, number],
    chunks: ChunksData,
    size: number,
    layer: number
  ) {
    this.origin = origin;
    this.size = size;
    this.chunks = chunks;
    this.layer = layer;
    this.key = this.getKey();
    this.getValueCallback = this.chunks.get.bind(this.chunks);
  }

  get(i: number, j: number, k: number): number | null {
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
    return this.data[index] ?? null;
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
      return this.getValueCallback(
        i + this.origin[0],
        j + this.origin[1],
        k + this.origin[2]
      );
    }

    return this.get(i, j, k);
  }

  set(i: number, j: number, k: number, v: number): void {
    const index = i * this.size * this.size + j * this.size + k;
    this.data[index] = v;
    this.dirty = true;
  }

  setColor(i: number, j: number, k: number, color: Color): void {
    const index = i * this.size * this.size + j * this.size + k;
    this.color[index] = color;
    this.dirty = true;
  }

  getColor(i: number, j: number, k: number): Color {
    const index = i * this.size * this.size + j * this.size + k;
    const color = this.color[index];
    if (color == null) {
      return this.defaultColor;
    }
    return color;
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
    const normal = [
      (this.getWorld(i + 1, j, k) ?? 0) - (this.getWorld(i - 1, j, k) ?? 0),
      (this.getWorld(i, j + 1, k) ?? 0) - (this.getWorld(i, j - 1, k) ?? 0),
      (this.getWorld(i, j, k + 1) ?? 0) - (this.getWorld(i, j, k - 1) ?? 0),
    ] as [number, number, number];
    return normalize(normal);
  }
}

export const normalize = (
  coord: [number, number, number]
): [number, number, number] => {
  const [i, j, k] = coord;
  const dis = Math.sqrt(i * i + j * j + k * k);
  return [i / dis, j / dis, k / dis];
};
