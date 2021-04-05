import { useEffect } from "react";
import { useTreeStore } from "StoreProvider";
import { Vector3 } from "three";
import placeTree from "../placeTree";

export interface TreeProps {
  position: Vector3;
  normal: Vector3;
  size: number;
}

export default function Tree({ position: coord, normal, size }: TreeProps) {
  const treeStore = useTreeStore();
  const treeChunks = treeStore.chunks;

  useEffect(() => {
    placeTree(treeChunks, coord, normal, size);
  }, []);

  return null;
}
