import { useEffect } from "react";
import { Vector3 } from "three";
import React from "react";
import _ from "lodash";
import { Tree } from "./Tree";
import { observer } from "mobx-react-lite";
import { useTreeStore } from "StoreProvider";

export interface TreeChunkProps {
  origin: Vector3;
  version: number;
}

export const TreeChunk = observer(({ version, origin }: TreeChunkProps) => {
  const treeStore = useTreeStore();
  const trees = treeStore.getTrees(origin);

  useEffect(() => {
    if (version === 0) {
      return;
    }
    treeStore.generateTrees(origin);
  }, [version]);

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
