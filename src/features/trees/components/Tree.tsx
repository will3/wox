import { useEffect } from "react";
import { Vector3 } from "three";
import Layers from "../../../Layers";
import { useChunkStore } from "../../chunks/store";
import placeTree from "../placeTree";

export interface TreeProps {
  position: Vector3;
  normal: Vector3;
  size: number;
}

export default function Tree({ position: coord, normal, size }: TreeProps) {
  const chunks = useChunkStore((state) => state.chunks[Layers.trees]);

  useEffect(() => {
    placeTree(chunks, coord, normal, size);
  }, []);

  return null;
}
