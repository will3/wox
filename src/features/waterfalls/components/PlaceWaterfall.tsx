import { useInputStore } from "../../../stores/input";
import { HoverState } from "../../../HoverState";
import { useEffect, useCallback } from "react";
import { Vector3 } from "three";
import traceWaterfall from "../traceWaterfall";
import Layers from "../../../Layers";
import { useWaterStore } from "../../water/water";
import { useChunkStore } from "../../chunks/store";

export default function PlaceWaterfall() {
  // TODO fix
  // const addWaterfall = useWaterfallStore((state) => state.addWaterfall);
  const groundChunks = useChunkStore((state) => state.chunks[Layers.ground]);
  const waterLevel = useWaterStore((state) => state.waterLevel);

  let hover: HoverState | null = null;
  useInputStore.subscribe<HoverState | null>(
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

    // addWaterfall({
    //   key: position.toArray().join(","),
    //   position,
    //   points: result.points,
    // });
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      return window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null;
}
