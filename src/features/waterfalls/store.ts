import { Vector3 } from "three";
import seedrandom from "seedrandom";
import { clamp } from "lodash";
import { Noise } from "../../utils/Noise";
import traceWaterfall from "./traceWaterfall";
import ChunksData from "features/chunks/ChunksData";
import { makeAutoObservable } from "mobx";
import { GroundStore } from "features/ground/store";

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

export class WaterfallStore {
  waterfalls: { [key: string]: WaterfallData } = {};
  waterfallChunks: { [key: string]: WaterfallChunkData } = {};
  seed: string;
  groundStore: GroundStore;

  constructor(seed: string, groundStore: GroundStore) {
    makeAutoObservable(this);
    this.seed = seed;
    this.groundStore = groundStore;
  }

  get noise() {
    return new Noise({
      seed: this.seed,
      frequency: 0.01,
    });
  }

  generateWaterfalls(origin: Vector3) {
    const { maxHeight } = this.groundStore;
    const waterLevel = this.groundStore.waterLevel;
    const groundChunks = this.groundStore.chunks;
    const chunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );
    const rng = seedrandom(this.seed + "generateWaterfalls" + chunk.key);
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
