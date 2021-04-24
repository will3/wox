import { Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import QuadMap from "../../utils/QuadMap";
import { makeAutoObservable } from "mobx";
import ChunksData from "features/chunks/ChunksData";
import { GroundStore } from "features/ground/store";
import seedrandom from "seedrandom";
import { VoxelInfo } from "features/chunks/VoxelInfo";

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
  groundStore: GroundStore;
  treeValueOffset = 0.6;
  minDistance = 6;
  baseChance = 1 / 24;

  constructor(seed: string, chunks: ChunksData, groundStore: GroundStore) {
    makeAutoObservable(this);
    this.seed = seed;
    this.chunks = chunks;
    this.groundStore = groundStore;
  }

  get noise() {
    return new Noise({
      frequency: 0.005,
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

  generateTrees(origin: Vector3) {
    const groundChunks = this.groundStore.chunks;

    const chunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );

    if (chunk == null) {
      return;
    }

    const meshData = chunk.meshData!;

    if (meshData.faces.length === 0) {
      return;
    }


    const trees: TreeData[] = [];


    for (const upFace of meshData.upFaces) {
      const face = meshData.faces[upFace];
      const voxel = meshData.voxels[face.voxelIndex];
      const position = new Vector3().fromArray(voxel.coord).add(origin);
      const voxelNormal = voxel.voxelNormal;

      const tree = this.generateTree(position, new Vector3().fromArray(voxelNormal));

      if (tree != null) {
        this.treeMap.set(position, tree);
        trees.push(tree);
      }
    }

    this.setTrees(origin, trees);

    console.log(`Generated ${trees.length} trees for ${origin.toArray().join(",")}`);
  }

  generateTree(position: Vector3, voxelNormal: Vector3) {
    const noise = this.noise;
    const treeMap = this.treeMap;
    const groundStore = this.groundStore;
    const maxHeight = groundStore.maxHeight;
    const waterLevel = groundStore.waterLevel;
    const seed = this.seed;

    const rng = seedrandom(seed + "generateTrees" + position.toArray().join(","))
    const value = rng();
    if (value > this.baseChance) {
      return;
    }

    if (position.y < waterLevel + 3) {
      return;
    }
    const relY = position.y / maxHeight;
    // const yFactor = Math.pow(1 - relY, 0.9);
    // const up = 1 - clamp(new Vector3(0, -1, 0).dot(voxelNormal), 0, 1);
    const nv = noise.get(position);
    //const v = -Math.abs(nv) * yFactor * up + 0.2;
    const v = -Math.abs(nv) + this.treeValueOffset;
    if (v < 0) {
      return;
    }

    const size = 1 + Math.pow(rng(), 1.5) * 0.5;
    const otherTrees = treeMap.find(position, this.minDistance * size);

    if (otherTrees.length > 0) {
      return;
    }

    return {
      key: position.toArray().join(","),
      normal: voxelNormal,
      size,
      position,
    };
  }
}
