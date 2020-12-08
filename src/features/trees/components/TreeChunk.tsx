import { useEffect } from "react";
import { Vector3 } from "three";
import { TreeData, useTreeStore } from "../store";
import React from "react";
import _ from "lodash";
import Tree from "./Tree";
import { useChunks } from "features/chunks/ChunksProvider";
import Layers from "features/chunks/Layers";
import { useGroundStore } from "features/ground/store";
import { useWaterStore } from "features/water/water";
import seedrandom from "seedrandom";

export interface TreeChunkProps {
  origin: Vector3;
  version: number;
}

export function TreeChunk({ version, origin }: TreeChunkProps) {
  const key = origin.toArray().join(",");
  const trees = useTreeStore((state) => state.trees[key]);
  const { chunks } = useChunks();
  const noise = useTreeStore((state) => state.noise);
  const treeMap = useTreeStore((state) => state.treeMap);
  const maxHeight = useGroundStore((state) => state.maxHeight);
  const waterLevel = useWaterStore((state) => state.waterLevel);
  const seed = useTreeStore((state) => state.seed);
  const setTrees = useTreeStore((state) => state.setTrees);

  const generateTrees = () => {
    const chunk = chunks[Layers.ground].getChunk(
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
        trees.push(tree);
      }
    }

    setTrees(origin, trees);
  };

  useEffect(() => {
    if (version === 0) {
      return;
    }
    console.log(`Generate trees for ${origin.toArray().join(",")}`);
    generateTrees();
  }, [version]);

  return (
    <>
      {_.map(trees, (tree) => (
        <Tree
          key={tree.key}
          position={tree.position}
          normal={tree.normal}
          size={tree.size}
        />
      ))}
    </>
  );
}
