import { Vector3 } from "three";
import create from "zustand";
import { Noise } from "../../utils/Noise";
import QuadMap from "../../utils/QuadMap";
import { groundStore } from "features/ground/store";

export interface TreeData {
  key: string;
  normal: Vector3;
  size: number;
  position: Vector3;
}

const seed = groundStore.seed;
const noise = new Noise({
  frequency: 0.0025,
  seed: seed + "tree",
});

export interface TreeState {
  treeMap: QuadMap<TreeData>;
  noise: Noise;
  trees: { [id: string]: { [key: string]: TreeData } };
  seed: string;
  setTrees(origin: Vector3, trees: TreeData[]): void;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  treeMap: new QuadMap(),
  noise: noise,
  trees: {},
  seed,
  setTrees(origin: Vector3, treesToAdd: TreeData[]) {
    const key = origin.toArray().join(",");
    const trees = { ...get().trees };
    const map: { [key: string]: TreeData } = {};
    trees[key] = map;
    for (const tree of treesToAdd) {
      map[tree.key] = tree;
    }
    set({ trees });
  },
}));
