import { Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import QuadMap from "../../utils/QuadMap";
import { groundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";

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

export class TreeStore {
  treeMap = new QuadMap<TreeData>();
  noise = noise;
  trees: { [id: string]: { [key: string]: TreeData } } = {};
  seed = seed;

  constructor() {
    makeAutoObservable(this);
  }

  setTrees(origin: Vector3, treesToAdd: TreeData[]) {
    const key = origin.toArray().join(",");
    if (this.trees[key] == null) {
      this.trees[key] = {};
    }
    for (const tree of treesToAdd) {
      this.trees[key][tree.key] = tree;
    }
  }

  getTrees(origin: Vector3) {
    const key = origin.toArray().join(",");
    return this.trees[key];
  }
}

export const treeStore = new TreeStore();
