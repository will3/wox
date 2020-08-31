import ChunkData from "./ChunkData";

export default class ChunksData {
  map: { [key: string]: ChunkData } = {};
  size: number;
  dirty = false;

  constructor(size = 32) {
    this.size = size;
  }

  get(i: number, j: number, k: number) {
    const origin = this.getOrigin(i, j, k);
    const chunk = this.getChunk(origin);
    if (chunk == null) {
      return null;
    }
    return chunk.get(i - origin[0], j - origin[1], k - origin[2]);
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
      this.map[key] = new ChunkData(origin, this);
      this.dirty = true;
    }
    return this.map[key];
  }
}
