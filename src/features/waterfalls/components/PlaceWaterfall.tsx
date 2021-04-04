import { useEffect, useCallback } from "react";
import { Vector3 } from "three";
import traceWaterfall from "../traceWaterfall";
import Layers from "../../chunks/Layers";
import { useChunks } from "features/chunks/hooks/useChunks";
import { waterStore } from "features/water/store";
import { observer } from "mobx-react-lite";
import { inputStore } from "features/input/store";

export const PlaceWaterfall = observer(() => {
  const chunks = useChunks();
  const groundChunks = chunks[Layers.ground];
  const waterLevel = waterStore.waterLevel;
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
