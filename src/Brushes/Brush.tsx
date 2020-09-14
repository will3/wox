import { useEffect, useMemo } from "react";
import { useInputStore } from "../stores/input";
import { HoverState } from "../HoverState";
import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import { calcSphereStroke } from "../utils/math";
import Layers from "../Layers";
import { useChunkStore } from "../stores/chunk";

export default function Brush() {
  const chunks = useChunkStore((state) => state.chunks[Layers.ground]);

  let hover: HoverState | null;

  useInputStore.subscribe(
    (h) => {
      hover = h as HoverState | null;
    },
    (state) => state.hover
  );

  let isDown = false;

  const stroke = useMemo(() => calcSphereStroke(1.5), []);

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

      const { coord } = hover;

      for (const voxel of stroke) {
        const next = new Vector3().fromArray(coord).add(voxel.coord);

        const value = chunks.get(next.x, next.y, next.z) ?? 0;
        chunks.set(next.x, next.y, next.z, value + voxel.value * 0.1);
        chunks.setColor(next.x, next.y, next.z, [0.1, 0.1, 0.1]);
      }
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
}
