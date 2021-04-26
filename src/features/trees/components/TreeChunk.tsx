import { useEffect } from "react";
import { Vector3 } from "three";
import React from "react";
import _ from "lodash";
import { Tree } from "./Tree";
import { observer } from "mobx-react-lite";
import { useChunksStore, useTreeStore } from "StoreProvider";
import { GroundData } from "features/ground/store";

export interface TreeChunkProps {
  ground: GroundData
}

export const TreeChunk = observer(({ ground }: TreeChunkProps) => {
  const origin = ground.origin;
  const treeStore = useTreeStore();
  const trees = treeStore.getTrees(origin);
  const chunksStore = useChunksStore();
  const chunkVersion = chunksStore.getChunkVersion(ground.chunkId);

  useEffect(() => {
    if (chunkVersion > 0) {
      treeStore.generateTrees(origin);
    }
  }, [chunkVersion]);

  return (
    <>
      {_.map(trees, (tree) => (
        <Tree
          key={tree.key}
          data={tree}
        />
      ))}
    </>
  );
});
