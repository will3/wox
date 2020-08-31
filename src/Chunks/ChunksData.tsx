import ChunkData from "./ChunkData";

export default class ChunksData {
  map: { [key: string]: ChunkData } = {};
  size: number;
  dirty = false;
  version = 1;
  layer: number;

  constructor(size: number, layer: number = 0) {
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

  setColor(i: number, j: number, k: number, color: [number, number, number]) {
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
      return [1.0, 0.0, 1.0];
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
      this.map[key] = new ChunkData(origin, this, this.size, this.layer);
      this.dirty = true;
    }
    return this.map[key];
  }
}
