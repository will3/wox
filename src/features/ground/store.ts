import { Color, Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import Curve from "../../utils/Curve";
import ChunksData from "features/chunks/ChunksData";
import { wait } from "utils/wait";
import { makeAutoObservable } from "mobx";
import _ from "lodash";
import { ChunksStore } from "features/chunks/store";
import shuffle from "shuffle-array";
import { nanoid } from "nanoid";

export interface GroundData {
  key: string;
  chunkId: string;
  origin: Vector3;
  version: number;
}

export class GroundStore {
  numChunks = new Vector3(4, 2, 4);
  chunkSize = 32;
  curve = new Curve([-1, -0.6, -0.2, 0.2, 2], [-1, -0.58, -0.4, -0.3, 1.5]);
  gradientCurve = new Curve([0, 1], [0.7, -0.8])
  grounds: { [key: string]: GroundData } = {};
  maxHeight = 32;
  rockColor = new Color(0.072, 0.08, 0.09);
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
    const shuffled = shuffle(origins);
    for (const origin of shuffled) {
      const key = origin.toArray().join(",");
      if (this.grounds[key] == null) {
        this.grounds[key] = {
          key,
          origin,
          version: 0,
          chunkId: nanoid()
        };
      }
    }
  }

  async generateAllChunks() {
    this.addGrounds(this.origins);
    for (const origin of this.origins) {
      this.generateChunk(origin);
      await wait(0);
    }
  }

  generateChunk(origin: Vector3) {
    const start = new Date().getTime();
    const key = origin.toArray().join(",");
    this.generateGround(origin);
    this.incrementVersion(key);
    console.log(`Took ${new Date().getTime() - start}ms`);
  }

  generateGround(origin: Vector3) {
    const chunks = this.chunks;
    const { rockColor } = this;
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );
    const key = origin.toArray().join(",");
    const ground = this.grounds[key];
    chunk.id = ground.chunkId;

    chunk.getWorldValue = (i, j, k) => {
      return this.getValue(
        new Vector3(i, j, k)
      );
    };

    chunks.defaultColor = rockColor;
    chunk.defaultColor = rockColor;

    console.log(`Generated chunk ${chunk.key}`);

    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          const worldCoord = origin.clone().add(new Vector3(i, j, k));
          const v = this.getValue(worldCoord);
          chunk.set(i, j, k, v);
        }
      }
    }

    this.chunksStore.updateMeshData(chunk);
  }

  incrementVersion(id: string) {
    const grounds = this.grounds;
    grounds[id].version++;
  }

  getValue(
    worldCoord: Vector3
  ) {
    const absY = worldCoord.y;
    if (absY === 0) {
      return 1.0;
    }
    const relY = absY / this.maxHeight;
    const gradient = this.gradientCurve.sample(relY);
    let nv = this.groundNoise.get(worldCoord);
    nv = this.curve.sample(nv);
    const v = nv + gradient;
    return v;
  }
}
