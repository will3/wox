import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTreeStore } from "StoreProvider";
import placeTree from "../placeTree";
import { TreeData } from "../store";

export interface TreeProps {
  data: TreeData;
}

export const Tree = observer(({ data }: TreeProps) => {
  const treeStore = useTreeStore();
  const treeChunks = treeStore.chunks;

  useEffect(() => {
    placeTree(treeChunks, data);
  }, []);

  return null;
});
