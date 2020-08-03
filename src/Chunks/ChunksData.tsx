import { ChunkData } from ".";

export default class ChunksData {
  map: { [key: string]: ChunkData } = {};
  size: number;

  constructor(size = 32) {
    this.size = size;
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
      this.map[key] = new ChunkData(origin);
    }
    return this.map[key];
  }
}
