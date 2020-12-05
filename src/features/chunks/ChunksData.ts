import ChunkData from "./ChunkData";
import { ColorValue } from "./types";

export default class ChunksData {
  map: { [key: string]: ChunkData } = {};
  size: number;
  dirty = false;
  layer: number;
  normalBias = 0.5;
  skyBias = 0.5;
  isWater = false;
  offset = [0, 0, 0];
  hasBounds = false;
  renderAllSurfaces = false;
  defaultColor: ColorValue = 0x000000;

  constructor(size: number, layer = 0) {
    this.size = size;
    this.layer = layer;
  }

  get(i: number, j: number, k: number) {
    const origin = this.getOrigin(i, j, k);
    const chunk = this.getChunk(origin);
    if (chunk == null) {
      return null;
    }
    return chunk.get(i - origin[0], j - origin[1], k - origin[2]);
  }

  set(i: number, j: number, k: number, v: number) {
    const origin = this.getOrigin(i, j, k);
    const chunk = this.getOrCreateChunk(origin);
    return chunk.set(i - origin[0], j - origin[1], k - origin[2], v);
  }

  setColor(i: number, j: number, k: number, color: ColorValue) {
    if (i < 0 || j < 0 || k < 0) {
      return;
    }
    const origin = this.getOrigin(i, j, k);
    const chunk = this.getOrCreateChunk(origin);
    return chunk.setColor(i - origin[0], j - origin[1], k - origin[2], color);
  }

  getColor(i: number, j: number, k: number) {
    const origin = this.getOrigin(i, j, k);
    const chunk = this.getChunk(origin);
    if (chunk == null) {
      return this.defaultColor;
    }
    return chunk.getColor(i - origin[0], j - origin[1], k - origin[2]);
  }

  getOrigin(i: number, j: number, k: number): [number, number, number] {
    return [
      Math.floor(i / this.size) * this.size,
      Math.floor(j / this.size) * this.size,
      Math.floor(k / this.size) * this.size,
    ];
  }

  getKey(origin: [number, number, number]) {
    return origin.join(",");
  }

  getChunk(origin: [number, number, number]) {
    const key = this.getKey(origin);
    return this.map[key];
  }

  getOrCreateChunk(origin: [number, number, number]) {
    const key = this.getKey(origin);
    if (this.map[key] == null) {
      const chunk = new ChunkData(origin, this, this.size, this.layer);
      this.map[key] = chunk;
      chunk.isWater = this.isWater;
      this.dirty = true;
    }
    return this.map[key];
  }

  visitChunk(callback: (chunk: ChunkData) => void) {
    for (const key in this.map) {
      callback(this.map[key]);
    }
  }

  isSurface(i: number, j: number, k: number) {
    return (
      (this.get(i, j, k) ?? 0) > 0 &&
      ((this.get(i + 1, j, k) ?? 0) < 0 ||
        (this.get(i - 1, j, k) ?? 0) < 0 ||
        (this.get(i, j + 1, k) ?? 0) < 0 ||
        (this.get(i, j - 1, k) ?? 0) < 0 ||
        (this.get(i, j, k + 1) ?? 0) < 0 ||
        (this.get(i, j, k - 1) ?? 0) < 0)
    );
  }
}
