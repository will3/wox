import create from "zustand";
import ChunksData from "../Chunks/ChunksData";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import { useStore } from "./store";
import { meshChunk } from "../Chunks/meshChunk";
import { useWaterStore } from "./water";

export interface ChunksState {
  chunks: ChunksData[];
  versions: number[];
  chunkVersions: { [layer: number]: { [id: string]: number } };
  incrementVersion(layer: number): void;
  updateMeshData(layer: number, id: string): void;
}

const treesChunk = new ChunksData(chunkSize, Layers.trees);
treesChunk.normalBias = 0.8;

const waterChunk = new ChunksData(chunkSize, Layers.water);
waterChunk.isWater = true;
waterChunk.normalBias = 1.0;
waterChunk.skyBias = 1.0;
waterChunk.offset = [0, -0.5, 0];

const structureChunks = new ChunksData(chunkSize, Layers.structures);
structureChunks.renderAllSurfaces = true;

const chunks = [
  new ChunksData(chunkSize, Layers.ground),
  treesChunk,
  waterChunk,
  structureChunks,
];

export const useChunkStore = create<ChunksState>((set, get) => ({
  chunks,
  versions: chunks.map((_) => 0),
  chunkVersions: {},
  incrementVersion(layer: number) {
    const versions = [...get().versions];
    versions[layer]++;

    set({ versions });
  },
  updateMeshData(layer: number, id: string) {
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
