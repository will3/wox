import { useEffect } from "react";
import { Vector3 } from "three";
import { useTreeStore } from "../stores/tree";
import React from "react";
import _ from "lodash";
import Tree from "./Tree";

export interface TreeChunkProps {
  origin: Vector3;
  version: number;
}

export function TreeChunk({ version, origin }: TreeChunkProps) {
  const key = origin.toArray().join(",");
  const generateTrees = useTreeStore((state) => state.generateTrees);
  const trees = useTreeStore((state) => state.trees[key]);

  useEffect(() => {
    console.log(`Generate trees for ${origin.toArray().join(",")}`);
    if (version === 0) {
      return;
    }
    generateTrees(origin);
  }, [version]);

  return (
    <>
      {_.map(trees, (tree) => (
        <Tree position={tree.position} normal={tree.normal} size={tree.size}/>
      ))}
    </>
  );
}
