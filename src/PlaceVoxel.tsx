import { useEffect } from "react";
import { useStore, HoverState } from "./store";
import ChunksData from "./Chunks/ChunksData";
import React from "react";
import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";

export interface PlaceVoxelProps {
  chunks: ChunksData;
}

const PlaceVoxelInternal = ({ chunks }: PlaceVoxelProps) => {
  let hover: HoverState | null;

  useStore.subscribe(
    (h) => {
      hover = h as HoverState | null;
    },
    (state) => state.hover
  );

  let isDown = false;
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      isDown = true;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      isDown = false;
    }
  };

  useFrame(() => {
    if (isDown) {
      if (hover == null) {
        return;
      }

      const { coord, normal } = hover;
      const next = new Vector3()
        .fromArray(coord)
        .add(new Vector3().fromArray(normal));
      chunks.set(next.x, next.y, next.z, 0.01);
      chunks.setColor(next.x, next.y, next.z, [1.0, 1.0, 1.0]);
    }
  });

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  });

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return null;
};

export default function PlaceVoxel() {
  const chunks = useStore((state) => state.chunks);
  return <PlaceVoxelInternal chunks={chunks} />;
};
