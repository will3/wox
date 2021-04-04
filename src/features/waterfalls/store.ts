import { Vector3 } from "three";
import Layers from "../chunks/Layers";
import seedrandom from "seedrandom";
import { clamp } from "lodash";
import { Noise } from "../../utils/Noise";
import traceWaterfall from "./traceWaterfall";
import { groundStore } from "features/ground/store";
import ChunksData from "features/chunks/ChunksData";
import { waterStore } from "features/water/store";
import { makeAutoObservable } from "mobx";

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

const seed = groundStore.seed + "waterfall";

export class WaterfallStore {
  waterfalls: { [key: string]: WaterfallData } = {};
  waterfallChunks: { [key: string]: WaterfallChunkData } = {};
  seed = seed;
  noise = new Noise({
    seed,
    frequency: 0.01,
  });

  constructor() {
    makeAutoObservable(this);
  }

  generateWaterfalls(chunks: ChunksData[], origin: Vector3) {
    const { maxHeight } = groundStore;
    const waterLevel = waterStore.waterLevel;
    const groundChunks = chunks[Layers.ground];
    const chunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );
    const rng = seedrandom(seed + "generateWaterfalls" + chunk.key);
    const meshData = chunk.meshData;
    if (meshData == null) {
      throw new Error("Mesh data is empty");
    }
    const noise = this.noise;

    if (meshData.upFaces.length === 0) {
      return;
    }

    const density = 1 / 420;

    const key = origin.toArray().join(",");
    this.waterfallChunks[key] = {
      key,
      origin,
      waterfallIds: [],
    };

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

      this.waterfallChunks[key].waterfallIds.push(waterfall.key);
      this.waterfalls[waterfall.key] = waterfall;
    }
  }

  setWaterfallChunks(origins: Vector3[]) {
    for (const origin of origins) {
      const key = origin.toArray().join(",");
      this.waterfallChunks[key] = {
        key,
        origin,
        waterfallIds: [],
      };
    }
  }
}

export const waterfallStore = new WaterfallStore();
