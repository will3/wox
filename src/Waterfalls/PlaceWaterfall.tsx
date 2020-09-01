import { useStore, HoverState } from "../store";
import { useEffect, useCallback } from "react";
import { Vector3 } from "three";

export default function PlaceWaterfall() {
  const addWaterfall = useStore((state) => state.addWaterfall);

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
    addWaterfall({
      key: position.toArray().join(","),
      position,
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
