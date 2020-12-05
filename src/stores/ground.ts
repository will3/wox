import { Color, Vector3 } from "three";
import create from "zustand";
import Layers from "../Layers";
import { Noise } from "../Noise";
import Curve from "../utils/Curve";
import { useChunkStore } from "../features/chunks/store";
import { useWaterStore } from "./water";

export interface GroundData {
  key: string;
  origin: Vector3;
  version: number;
}

export interface GroundState {
  size: Vector3;
  curve: Curve;
  grounds: { [id: string]: GroundData };
  addGrounds(origins: Vector3[]): void;
  incrementVersion(id: string): void;
  maxHeight: number;
  rockColor: Color;
  grassColor: Color;
  generateGround(origin: Vector3): void;
  generateGrass(origin: Vector3): void;
  noise: Noise;
  seed: string;
}

const updateMeshData = useChunkStore.getState().updateMeshData;

const seed = "1337";

export const useGroundStore = create<GroundState>((set, get) => ({
  noise: new Noise({
    scale: new Vector3(1, 0.6, 1),
    seed,
  }),
  size: new Vector3(3, 2, 3),
  curve: new Curve([-1, -0.4, 0.2, 2], [-1, -0.58, -0.48, 1.5]),
  grounds: {},
  addGrounds(origins: Vector3[]) {
    const grounds = { ...get().grounds };

    for (const origin of origins) {
      const key = origin.toArray().join(",");
      if (grounds[key] == null) {
        grounds[key] = {
          key,
          origin,
          version: 0,
        };
      }
    }

    set({ grounds });
  },
  generateGround(origin: Vector3) {
    const { rockColor, curve, noise, maxHeight } = get();
    const chunks = useChunkStore.getState().chunks[Layers.ground];
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );

    chunk.getValueCallback = (i, j, k) => {
      return getValue(
        noise,
        curve,
        origin,
        maxHeight,
        i - origin.x,
        j - origin.y,
        k - origin.z
      );
    };

    chunks.defaultColor = rockColor.toArray();
    chunk.defaultColor = rockColor.toArray();

    console.log(`Generated chunk ${chunk.key}`);

    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          chunk.setColor(i, j, k, rockColor.toArray());
          const v = getValue(noise, curve, origin, maxHeight, i, j, k);
          chunk.set(i, j, k, v);
        }
      }
    }

    updateMeshData(Layers.ground, chunk.key);
  },
  generateGrass(origin: Vector3) {
    const chunks = useChunkStore.getState().chunks[Layers.ground];
    const chunk = chunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );
    const { waterLevel } = useWaterStore.getState();
    const grassColor = get().grassColor.toArray();
    const size = chunk.size;
    const meshData = chunk.meshData!;
    const voxels = meshData.voxels;

    for (let voxel of voxels) {
      const [i, j, k] = voxel.coord;
      const absY = chunk.origin[1] + j;
      if (absY <= waterLevel) {
        continue;
      }

      const normal = voxel.voxelNormal;

      const dot = new Vector3(0, -1, 0).dot(new Vector3().fromArray(normal));

      if (dot > 0.75) {
        chunk.setColor(i, j, k, grassColor);
      }
    }
  },
  incrementVersion(id: string) {
    const grounds = { ...get().grounds };
    grounds[id].version++;

    set({ grounds });
  },
  maxHeight: 64,
  rockColor: new Color(0.072, 0.08, 0.09),
  grassColor: new Color(0.08, 0.1, 0.065),
  seed,
}));

const getValue = (
  noise: Noise,
  curve: Curve,
  origin: Vector3,
  maxHeight: number,
  i: number,
  j: number,
  k: number
) => {
  const absY = origin.y + j;
  const relY = absY / maxHeight;
  const gradient = (-relY * 2 + 1) * 0.75;
  const position = new Vector3().fromArray([i, j, k]).add(origin);
  let nv = noise.get(position);
  nv = curve.sample(nv);
  const v = nv + gradient;
  return v;
};
