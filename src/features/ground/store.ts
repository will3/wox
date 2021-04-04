import { Color, Vector2, Vector3 } from "three";
import Layers from "../chunks/Layers";
import { Noise } from "../../utils/Noise";
import Curve from "../../utils/Curve";
import { useChunkStore } from "../chunks/store";
import { useWaterStore } from "../water/water";
import { ColorValue } from "features/chunks/types";
import ChunksData from "features/chunks/ChunksData";
import { wait } from "utils/wait";
import { makeAutoObservable } from "mobx";

export interface GroundData {
  key: string;
  origin: Vector3;
  version: number;
}

const updateMeshData = useChunkStore.getState().updateMeshData;

export class GroundStore {
  size = new Vector3(4, 2, 4);
  chunkSize = 32;
  curve = new Curve([-1, -0.4, 0.2, 2], [-1, -0.58, -0.48, 1.5]);
  grounds: { [key: string]: GroundData } = {};
  maxHeight = 64;
  rockColor = new Color(0.072, 0.08, 0.09);
  grassColor = new Color(0.08, 0.1, 0.065);
  seed = "1337";

  constructor() {
    makeAutoObservable(this);
  }

  addGrounds(origins: Vector3[]) {
    const grounds = this.grounds;

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

  async generateColumns(columns: Vector2[], chunks: ChunksData[], noise: Noise) {
    const {  size, chunkSize } = this;
    const start = new Date().getTime();
    for (const column of columns) {
      for (let j = 0; j < size.y; j++) {
        const origin = new Vector3(column.x, j * chunkSize, column.y);
        const id = origin.toArray().join(",");
        this.generateGround(chunks, origin, noise);
        this.incrementVersion(id);
        this.generateGrass(chunks, origin);
      }
      await wait(0);
    }
    console.log(`Took ${new Date().getTime() - start}ms`);
  }

  generateGround(chunksList: ChunksData[], origin: Vector3, noise: Noise) {
    const { rockColor, curve, maxHeight } = this;
    const chunks = chunksList[Layers.ground];
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

    updateMeshData(chunksList, Layers.ground, chunk.key);
  }

  generateGrass(chunksList: ChunksData[], origin: Vector3) {
    const chunks = chunksList[Layers.ground];
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );
    const { waterLevel } = useWaterStore.getState();
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
    const gradient = (-relY * 2 + 1) * 0.75;
    const position = new Vector3().fromArray([i, j, k]).add(origin);
    let nv = noise.get(position);
    nv = curve.sample(nv);
    const v = nv + gradient;
    return v;
  }
}

export const groundStore = new GroundStore();