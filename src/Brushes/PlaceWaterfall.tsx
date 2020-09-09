import { useStore } from "../stores/store";
import { HoverState } from "../HoverState";
import { useEffect, useCallback } from "react";
import { Vector3 } from "three";
import traceWaterfall from "../Waterfalls/traceWaterfall";
import Layers from "../Layers";

export default function PlaceWaterfall() {
  const addWaterfall = useStore((state) => state.addWaterfall);
  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const waterLevel = useStore((state) => state.waterLevel);

  let hover: HoverState | null = null;
  useStore.subscribe<HoverState | null>(
    (h) => {
      hover = h;
    },
    (state) => state.hover
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button != 0) {
      return;
    }

    if (hover == null) {
      return;
    }

    const position = new Vector3().fromArray(hover.coord);

    const result = traceWaterfall(position, groundChunks, waterLevel);

    addWaterfall({
      key: position.toArray().join(","),
      position,
      points: result.points,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      return window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null;
}
