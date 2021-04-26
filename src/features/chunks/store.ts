import ChunksData from "./ChunksData";
import { meshChunk } from "./meshChunk";
import { makeAutoObservable } from "mobx";
import ChunkData from "./ChunkData";

export class ChunksStore {
  private chunksVersions: { [id: string]: number } = {};
  private chunkVersions: { [id: string]: number } = {};
  private map = new Map<string, ChunksData>();

  constructor() {
    makeAutoObservable(this);
  }

  get chunksList() {
    return [...this.map.values()];
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

  getChunksVersion(chunksId: string) {
    return this.chunksVersions[chunksId];
  }

  incrementChunkVersion(chunkId: string) {
    if (this.chunkVersions[chunkId] == null) {
      this.chunkVersions[chunkId] = 0;
    }
    this.chunkVersions[chunkId]++;
  }

  incrementChunksVersion(chunksId: string) {
    const versions = this.chunksVersions;
    if (versions[chunksId] == null) {
      versions[chunksId] = 0;
    }
    versions[chunksId]++;
  }

  updateMeshData(chunk: ChunkData) {
    const start = new Date().getTime();
    const chunks = chunk.chunks;
    const meshData = meshChunk(chunk);
    chunk.meshData = meshData;
    const end = new Date().getTime();
    console.log(
      `Meshed ${chunks.layer} ${chunk.origin.join(",")} ${meshData.vertices.length / 3
      } vertices, ${meshData.indices.length / 3} triangles ${end - start}ms`
    );
  }

  remeshAll() {
    for (const chunks of this.map.values()) {
      for (const chunk of chunks.chunks) {
        chunk.dirty = true;
      }
    }
  }
}
