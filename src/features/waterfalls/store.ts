import create from "zustand";
import { Vector3 } from "three";
import { useChunkStore } from "../chunks/store";
import Layers from "../chunks/Layers";
import seedrandom from "seedrandom";
import { clamp } from "lodash";
import { Noise } from "../../utils/Noise";
import traceWaterfall from "./traceWaterfall";
import { useWaterStore } from "../water/water";
import { useGroundStore } from "features/ground/store";
import { useChunks } from "features/chunks/ChunksProvider";
import ChunksData from "features/chunks/ChunksData";

export interface WaterfallPoint {
  coord: Vector3;
  value: number;
}

export interface WaterfallData {
  key: string;
  position: Vector3;
  points: WaterfallPoint[];
}

export interface WaterfallChunkData {
  key: string;
  origin: Vector3;
  waterfallIds: string[];
}

export interface WaterfallState {
  waterfalls: { [key: string]: WaterfallData };
  waterfallChunks: { [key: string]: WaterfallChunkData };
  generateWaterfalls(chunks: ChunksData[], origin: Vector3): void;
  setWaterfallChunks(origins: Vector3[]): void;
  noise: Noise;
}

const seed = useGroundStore.getState().seed + "waterfall";

export const useWaterfallStore = create<WaterfallState>((set, get) => ({
  waterfalls: {},
  waterfallChunks: {},
  seed,
  noise: new Noise({
    seed,
    frequency: 0.01,
  }),
  generateWaterfalls(chunks: ChunksData[], origin: Vector3) {
    const { maxHeight } = useGroundStore.getState();
    const waterLevel = useWaterStore.getState().waterLevel;
    const groundChunks = chunks[Layers.ground];
    const chunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );
    const rng = seedrandom(seed + "generateWaterfalls" + chunk.key);
    const meshData = chunk.meshData;
    if (meshData == null) {
      throw new Error("Mesh data is empty");
    }
    const noise = get().noise;

    if (meshData.upFaces.length === 0) {
      return;
    }

    const density = 1 / 420;

    const waterfallChunks = { ...get().waterfallChunks };
    const waterfalls = { ...get().waterfalls };

    const key = origin.toArray().join(",");
    const waterfallChunk = {
      key,
      origin,
      waterfallIds: [],
    } as WaterfallChunkData;
    waterfallChunks[key] = waterfallChunk;

    for (let i = 0; i < meshData.upFaces.length * density; i++) {
      const index = Math.floor(meshData.upFaces.length * rng());
      const faceIndex = meshData.upFaces[index];
      const face = meshData.faces[faceIndex];
      const voxel = meshData.voxels[face.voxelIndex];

      const position = new Vector3().fromArray(voxel.coord).add(origin);
      const relY = 1 - position.y / maxHeight;
      const yFactor = clamp((relY - 0.5) * 2, 0, 1);

      const v = -Math.abs(noise.get(position)) * yFactor;

      if (v < 0) {
        continue;
      }

      console.log(`Trace waterfall ${position.toArray().join(",")}`);
      const result = traceWaterfall(position, groundChunks, waterLevel);

      if (!result.reachedWater) {
        continue;
      }

      const points = result.points;
      const waterfall = {
        key: position.toArray().join(","),
        position,
        points,
      };

      waterfallChunk.waterfallIds.push(waterfall.key);
      waterfalls[waterfall.key] = waterfall;
    }

    set({
      waterfallChunks,
      waterfalls,
    });
  },
  setWaterfallChunks(origins: Vector3[]) {
    const waterfallChunks = { ...get().waterfallChunks };
    for (const origin of origins) {
      const key = origin.toArray().join(",");
      waterfallChunks[key] = {
        key,
        origin,
        waterfallIds: [],
      };

      set({ waterfallChunks });
    }
  },
}));
