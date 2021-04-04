import ChunksData from "./ChunksData";
import { meshChunk } from "./meshChunk";
import { makeAutoObservable } from "mobx";
import { waterStore } from "features/water/store";

export class ChunksStore {
  chunks: ChunksData[] = [];
  versions: { [id: string]: number } = {};
  chunkVersions: { [id: string]: number } = {};

  constructor() {
    makeAutoObservable(this);
  }

  getChunkVersion(chunkId: string) {
    return this.chunkVersions[chunkId] ?? 0;
  }

  addLayers(...chunksList: ChunksData[]) {
    this.chunks.push(...chunksList);
  }

  incrementVersion(layer: number) {
    const versions = this.versions;
    if (versions[layer] == null) {
      versions[layer] = 0;
    }
    versions[layer]++;
  }

  updateMeshData(chunks: ChunksData, id: string) {
    const waterLevel = waterStore.waterLevel;
    const start = new Date().getTime();
    const chunk = chunks.map[id];
    const meshData = meshChunk(chunk, waterLevel);
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

export const chunksStore = new ChunksStore();
