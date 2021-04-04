import { useChunks } from "features/chunks/hooks/useChunks";
import { useEffect } from "react";
import { Vector3 } from "three";
import Layers from "../../chunks/Layers";
import placeTree from "../placeTree";

export interface TreeProps {
  position: Vector3;
  normal: Vector3;
  size: number;
}

export default function Tree({ position: coord, normal, size }: TreeProps) {
  const chunks = useChunks();
  const treeChunks = chunks[Layers.trees];

  useEffect(() => {
    placeTree(treeChunks, coord, normal, size);
  }, []);

  return null;
}