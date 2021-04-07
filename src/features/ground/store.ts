import { Color, Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import Curve from "../../utils/Curve";
import { ColorValue } from "features/chunks/types";
import ChunksData from "features/chunks/ChunksData";
import { wait } from "utils/wait";
import { makeAutoObservable } from "mobx";
import _ from "lodash";
import { ChunksStore } from "features/chunks/store";

export interface GroundData {
  key: string;
  origin: Vector3;
  version: number;
}

export class GroundStore {
  numChunks = new Vector3(4, 1, 4);
  chunkSize = 32;
  curve = new Curve([-1, -0.4, 0.2, 2], [-1, -0.58, -0.48, 1.5]);
  grounds: { [key: string]: GroundData } = {};
  maxHeight = 32;
  rockColor = new Color(0.072, 0.08, 0.09);
  grassColor = new Color(0.08, 0.1, 0.065);
  seed: string;
  chunksStore: ChunksStore;
  waterLevel = 6;
  chunks: ChunksData;

  constructor(seed: string, chunksStore: ChunksStore, chunks: ChunksData) {
    makeAutoObservable(this);
    this.seed = seed;
    this.chunksStore = chunksStore;
    this.chunks = chunks;
  }

  get generatedOrigins() {
    return new Set(_.values(this.grounds).filter(x => x.version > 0).map(x => x.origin.toArray().join(",")));
  }

  get groundNoise() {
    return new Noise({
      scale: new Vector3(1, 0.6, 1),
      seed: this.seed,
    })
  }

  get origins() {
    const origins: Vector3[] = [];
    for (let i = 0; i < this.numChunks.x; i++) {
      for (let j = 0; j < this.numChunks.y; j++) {
        for (let k = 0; k < this.numChunks.z; k++) {
          origins.push(new Vector3(i, j, k).multiplyScalar(this.chunkSize));
        }
      }
    }

    return origins;
  }

  generatedOrigin(origin: Vector3) {
    return this.generatedOrigins.has(origin.toArray().join(","));
  }

  addGrounds(origins: Vector3[]) {
    for (const origin of origins) {
      const key = origin.toArray().join(",");
      if (this.grounds[key] == null) {
        this.grounds[key] = {
          key,
          origin,
          version: 0,
        };
      }
    }
  }

  async generateAllChunks(chunks: ChunksData) {
    for (const origin of this.origins) {
      this.generateChunk(chunks, origin);
      await wait(0);
    }
  }

  generateChunk(chunks: ChunksData, origin: Vector3) {
    const start = new Date().getTime();
    const key = origin.toArray().join(",");
    this.generateGround(chunks, origin, this.groundNoise);
    this.incrementVersion(key);
    this.generateGrass(chunks, origin);
    console.log(`Took ${new Date().getTime() - start}ms`);
  }

  generateGround(chunks: ChunksData, origin: Vector3, noise: Noise) {
    const { rockColor, curve, maxHeight } = this;
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );

    chunk.getValueCallback = (i, j, k) => {
      return this.getValue(
        noise,
        curve,
        origin,
        maxHeight,
        i - origin.x,
        j - origin.y,
        k - origin.z
      );
    };

    const rockColorValue: ColorValue = rockColor.getHex();
    chunks.defaultColor = rockColorValue;
    chunk.defaultColor = rockColorValue;

    console.log(`Generated chunk ${chunk.key}`);

    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          chunk.setColor(i, j, k, rockColorValue);
          const v = this.getValue(noise, curve, origin, maxHeight, i, j, k);
          chunk.set(i, j, k, v);
        }
      }
    }

    this.chunksStore.updateMeshData(chunks, chunk.key);
  }

  generateGrass(chunks: ChunksData, origin: Vector3) {
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );
    const waterLevel = this.waterLevel;
    const grassColorValue = this.grassColor.getHex();
    const meshData = chunk.meshData!;
    const voxels = meshData.voxels;

    for (const voxel of voxels) {
      const [i, j, k] = voxel.coord;
      const absY = chunk.origin[1] + j;
      if (absY <= waterLevel) {
        continue;
      }

      const normal = voxel.voxelNormal;

      const dot = new Vector3(0, -1, 0).dot(new Vector3().fromArray(normal));

      if (dot > 0.75) {
        chunk.setColor(i, j, k, grassColorValue);
      }
    }
  }

  incrementVersion(id: string) {
    const grounds = this.grounds;
    grounds[id].version++;
  }

  getValue(
    noise: Noise,
    curve: Curve,
    origin: Vector3,
    maxHeight: number,
    i: number,
    j: number,
    k: number
  ) {
    const absY = origin.y + j;
    const relY = absY / maxHeight;
    const gradientCurve = new Curve([0, 1], [0.6, -0.9]);
    const gradient = gradientCurve.sample(relY);
    const position = new Vector3().fromArray([i, j, k]).add(origin);
    let nv = noise.get(position);
    nv = curve.sample(nv);
    const v = nv + gradient;
    return v;
  }
}
