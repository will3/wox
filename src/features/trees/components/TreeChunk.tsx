import { useEffect } from "react";
import { Vector3 } from "three";
import { TreeData, treeStore } from "../store";
import React from "react";
import _ from "lodash";
import Tree from "./Tree";
import { useChunks } from "features/chunks/hooks/useChunks";
import Layers from "features/chunks/Layers";
import seedrandom from "seedrandom";
import { groundStore } from "features/ground/store";
import { waterStore } from "features/water/store";
import { observer } from "mobx-react-lite";

export interface TreeChunkProps {
  origin: Vector3;
  version: number;
}

export const TreeChunk = observer(({ version, origin }: TreeChunkProps) => {
  const trees = treeStore.getTrees(origin);
  const chunks = useChunks();
  const noise = treeStore.noise;
  const treeMap = treeStore.treeMap;
  const maxHeight = groundStore.maxHeight;
  const waterLevel = waterStore.waterLevel;
  const seed = treeStore.seed;

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

    treeStore.setTrees(origin, trees);

    console.log(`Generated ${trees.length} trees for ${origin.toArray().join(",")}`);
  };

  useEffect(() => {
    if (version === 0) {
      return;
    }
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
});
