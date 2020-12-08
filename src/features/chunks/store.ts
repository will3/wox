import create from "zustand";
import ChunksData from "./ChunksData";
import { meshChunk } from "./meshChunk";
import { useWaterStore } from "../water/water";

export interface ChunksState {
  versions: number[];
  chunkVersions: { [layer: number]: { [id: string]: number } };
  incrementVersion(layer: number): void;
  updateMeshData(chunks: ChunksData[], layer: number, id: string): void;
}

export const useChunkStore = create<ChunksState>((set, get) => ({
  // TODO
  versions: [0, 0, 0, 0],
  chunkVersions: {},
  incrementVersion(layer: number) {
    const versions = [...get().versions];
    versions[layer]++;

    set({ versions });
  },
  updateMeshData(chunks: ChunksData[], layer: number, id: string) {
    const waterLevel = useWaterStore.getState().waterLevel;
    const start = new Date().getTime();
    const chunk = chunks[layer].map[id];
    const meshData = meshChunk(chunk, waterLevel);
    chunk.meshData = meshData;
    const end = new Date().getTime();
    console.log(
      `Meshed ${layer} ${chunk.origin.join(",")} ${
        meshData.vertices.length / 3
      } vertices, ${meshData.indices.length / 3} triangles ${end - start}ms`
    );
    const chunkVersions = { ...get().chunkVersions };
    if (chunkVersions[layer] == null) {
      chunkVersions[layer] = {};
    }
    const byChunk = chunkVersions[layer];
    if (byChunk[chunk.key] == null) {
      byChunk[chunk.key] = 0;
    }
    byChunk[chunk.key]++;
    set({ chunkVersions });
  },
}));
