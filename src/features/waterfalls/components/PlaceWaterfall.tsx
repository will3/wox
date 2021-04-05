import { useEffect, useCallback } from "react";
import { Vector3 } from "three";
import traceWaterfall from "../traceWaterfall";
import { observer } from "mobx-react-lite";
import { useGroundStore, useInputStore } from "StoreProvider";

export const PlaceWaterfall = observer(() => {
  const groundStore = useGroundStore();
  const groundChunks = groundStore.chunks;
  const waterLevel = groundStore.waterLevel;
  const inputStore = useInputStore();
  const hover = inputStore.hover;

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
});
