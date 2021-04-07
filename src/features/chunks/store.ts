import ChunksData from "./ChunksData";
import { meshChunk } from "./meshChunk";
import { makeAutoObservable } from "mobx";

export class ChunksStore {
  versions: { [id: string]: number } = {};
  chunkVersions: { [id: string]: number } = {};
  waterLevel = 6;
  map = new Map<string, ChunksData>();

  constructor() {
    makeAutoObservable(this);
  }

  get chunksList() {
    return [...this.map.values()];
  }

  getVersion(chunksId: string) {
    return this.versions[chunksId];
  }

  addChunks(chunks: ChunksData) {
    this.map.set(chunks.id, chunks);
  }

  removeChunks(chunks: ChunksData) {
    this.map.delete(chunks.id);
  }

  getChunkVersion(chunkId: string) {
    return this.chunkVersions[chunkId] ?? 0;
  }

  incrementVersion(chunksId: string) {
    const versions = this.versions;
    if (versions[chunksId] == null) {
      versions[chunksId] = 0;
    }
    versions[chunksId]++;
  }

  updateMeshData(chunks: ChunksData, id: string) {
    const waterLevel = this.waterLevel;
    const start = new Date().getTime();
    const chunk = chunks.map[id];
    const meshData = meshChunk(chunk);
    chunk.meshData = meshData;
    const end = new Date().getTime();
    console.log(
      `Meshed ${chunks.layer} ${chunk.origin.join(",")} ${meshData.vertices.length / 3
      } vertices, ${meshData.indices.length / 3} triangles ${end - start}ms`
    );
    if (this.chunkVersions[chunk.id] == null) {
      this.chunkVersions[chunk.id] = 0;
    }
    this.chunkVersions[chunk.id]++;
  }
}
