import { useStore } from "../stores/store";
import { HoverState } from "../HoverState";
import { useEffect } from "react";
import {
  Vector3,
} from "three";
import ChunksData from "../Chunks/ChunksData";
import { VoxelInfo } from "../Chunks/VoxelInfo";
import { useThree } from "react-three-fiber";

export interface PlaceObjectProps {
  place(chunks: ChunksData[], coord: Vector3, voxel: VoxelInfo): void;
}

export default function PlaceObject({ place }: PlaceObjectProps) {
  const chunks = useStore((state) => state.chunks);

  let hover: HoverState | null = null;

  useStore.subscribe<HoverState | null>(
    (h) => {
      hover = h;
    },
    (state) => state.hover
  );

  const { scene } = useThree();

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
