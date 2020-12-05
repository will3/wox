import { Vector3 } from "three";
import create from "zustand";
import Layers from "../../Layers";
import { Noise } from "../../Noise";
import QuadMap from "../../utils/QuadMap";
import { useChunkStore } from "../chunks/store";
import seedrandom from "seedrandom";
import { useWaterStore } from "../water/water";
import { useGroundStore } from "features/ground/store";

export interface TreeData {
  key: string;
  normal: Vector3;
  size: number;
  position: Vector3;
}

const seed = useGroundStore.getState().seed;
const noise = new Noise({
  frequency: 0.0025,
  seed: seed + "tree",
});

export interface TreeState {
  treeMap: QuadMap<TreeData>;
  noise: Noise;
  generateTrees(origin: Vector3): void;
  trees: { [id: string]: { [key: string]: TreeData } };
}

export const useTreeStore = create<TreeState>((set, get) => ({
  treeMap: new QuadMap(),
  noise: noise,
  trees: {},
  generateTrees(origin: Vector3) {
    const chunk = useChunkStore
      .getState()
      .chunks[Layers.ground].getChunk(
        origin.toArray() as [number, number, number]
      );
    const { noise, treeMap } = get();
    const { maxHeight } = useGroundStore.getState();
    const waterLevel = useWaterStore.getState().waterLevel;
    const rng = seedrandom(seed + "generateTrees" + origin.toArray().join(","));

    const meshData = chunk.meshData!;

    if (meshData.faces.length === 0) {
      return;
    }

    const minDistance = 6;

    const chunkKey = origin.toArray().join(",");
    const treesInChunk: { [id: string]: TreeData } = {};
    const trees = { ...get().trees };
    trees[chunkKey] = treesInChunk;

    for (let i = 0; i < meshData.upFaces.length / 24; i++) {
      const index = Math.floor(meshData.upFaces.length * rng());
      const faceIndex = meshData.upFaces[index];
      const face = meshData.faces[faceIndex];

      const voxel = meshData.voxels[face.voxelIndex];
      const position = new Vector3().fromArray(voxel.coord).add(origin);
      if (position.y < waterLevel + 3) {
        continue;
      }
      const relY = position.y / maxHeight;
      // const yFactor = Math.pow(1 - relY, 0.9);
      const voxelNormal = voxel.voxelNormal;
      // const up = 1 - clamp(new Vector3(0, -1, 0).dot(voxelNormal), 0, 1);
      const nv = noise.get(position);
      //const v = -Math.abs(nv) * yFactor * up + 0.2;
      const v = -Math.abs(nv) + 0.4;
      if (v < 0) {
        continue;
      }

      const size = 1 + Math.pow(rng(), 1.5) * 0.5;
      const otherTrees = treeMap.find(position, minDistance * size);

      if (otherTrees.length === 0) {
        const tree = {
          key: position.toArray().join(","),
          normal: new Vector3().fromArray(voxelNormal),
          size,
          position,
        };
        treeMap.set(position, tree);
        treesInChunk[position.toArray().join(",")] = tree;
      }
    }

    set({ trees });
  },
}));
