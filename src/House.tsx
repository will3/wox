import { Vector3 } from "three";
import { useEffect } from "react";
import placeHouse from "./Brushes/placeHouse";
import { useStore } from "./store";
import { chunkSize } from "./constants";

export interface HouseProps {
  coord: Vector3;
  y: number;
}

export default function House({ coord, y }: HouseProps) {
  const chunks = useStore((state) => state.chunks);

  useEffect(() => {
    placeHouse(chunks, coord, y);
  }, []);
  return null;
}
