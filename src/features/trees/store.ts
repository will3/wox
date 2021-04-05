import { Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import QuadMap from "../../utils/QuadMap";
import { makeAutoObservable } from "mobx";
import ChunksData from "features/chunks/ChunksData";

export interface TreeData {
  key: string;
  normal: Vector3;
  size: number;
  position: Vector3;
}

export class TreeStore {
  treeMap = new QuadMap<TreeData>();
  trees: { [id: string]: { [key: string]: TreeData } } = {};
  seed: string;
  chunks: ChunksData;

  constructor(seed: string, chunks: ChunksData) {
    makeAutoObservable(this);
    this.seed = seed;
    this.chunks = chunks;
  }

  get noise() {
    return new Noise({
      frequency: 0.0025,
      seed: this.seed + "tree",
    });
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
