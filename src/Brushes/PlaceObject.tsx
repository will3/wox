import { useInputStore } from "../stores/input";
import { HoverState } from "../HoverState";
import { useEffect } from "react";
import {
  Vector3,
} from "three";
import ChunksData from "../Chunks/ChunksData";
import { VoxelInfo } from "../Chunks/VoxelInfo";
import { useChunkStore } from "../features/chunks/store";

export interface PlaceObjectProps {
  place(chunks: ChunksData[], coord: Vector3, voxel: VoxelInfo): void;
}

export default function PlaceObject({ place }: PlaceObjectProps) {
  const chunks = useChunkStore((state) => state.chunks);

  let hover: HoverState | null = null;

  useInputStore.subscribe<HoverState | null>(
    (h) => {
      hover = h;
    },
    (state) => state.hover
  );

  const handleMouseDown = () => {
    if (hover == null) {
      return;
    }

    const { coord, voxel } = hover;

    place(chunks, new Vector3().fromArray(coord), voxel);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null;
}
