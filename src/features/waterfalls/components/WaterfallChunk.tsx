import { Waterfall } from "./Waterfall";
import { Vector3 } from "three";
import { useWaterfallStore } from "../store";
import { useCallback, useEffect, useMemo } from "react";
import React from "react";
import { useChunks } from "features/chunks/hooks/useChunks";
import { groundStore } from "features/ground/store";

interface WaterfallChunkProps {
  origin: Vector3;
}

export default function WaterfallChunk({ origin }: WaterfallChunkProps) {
  const chunks = useChunks();
  const generateWaterfalls = useWaterfallStore(
    (state) => state.generateWaterfalls
  );

  const key = origin.toArray().join(",");
  const groundVersion = groundStore.grounds[key]?.version ?? 0;
  const waterfallIds = useWaterfallStore(
    (state) => state.waterfallChunks[key].waterfallIds
  );

  const waterfalls = useWaterfallStore(
    useCallback((state) => waterfallIds.map((id) => state.waterfalls[id]), [
      waterfallIds,
    ])
  );

  useEffect(() => {
    if (groundVersion === 0) {
      return;
    }
    generateWaterfalls(chunks, origin);
  }, [groundVersion]);

  return (
    <>
      {waterfalls.map((waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
}
