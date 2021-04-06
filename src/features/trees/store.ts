import { Vector3 } from "three";
import { Noise } from "../../utils/Noise";
import QuadMap from "../../utils/QuadMap";
import { makeAutoObservable } from "mobx";
import ChunksData from "features/chunks/ChunksData";
import { GroundStore } from "features/ground/store";
import seedrandom from "seedrandom";

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
  treeValueOffset = 0.8;

  constructor(seed: string, chunks: ChunksData, groundStore: GroundStore) {
    makeAutoObservable(this);
    this.seed = seed;
    this.chunks = chunks;
    this.groundStore = groundStore;
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

  generateTrees(origin: Vector3) {
    const noise = this.noise;
    const treeMap = this.treeMap;
    const groundStore = this.groundStore;
    const maxHeight = groundStore.maxHeight;
    const waterLevel = groundStore.waterLevel;
    const seed = this.seed;
    const groundChunks = groundStore.chunks;

    const chunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );

    const rng = seedrandom(seed + "generateTrees" + origin.toArray().join(","));

    const meshData = chunk.meshData!;

    if (meshData.faces.length === 0) {
      return;
    }

    const minDistance = 6;

    const trees: TreeData[] = [];

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
      const v = -Math.abs(nv) + this.treeValueOffset;
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
        trees.push(tree);
      }
    }

    this.setTrees(origin, trees);

    console.log(`Generated ${trees.length} trees for ${origin.toArray().join(",")}`);
  }
}
