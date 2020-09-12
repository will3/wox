import { Waterfall } from "./Waterfall";
import { Vector3 } from "three";
import { useWaterfallStore } from "../stores/waterfall";
import { useCallback, useEffect } from "react";
import React from "react";
import { useStore } from "../stores/store";

interface WaterfallChunkProps {
  origin: Vector3;
}

export default function WaterfallChunk({ origin }: WaterfallChunkProps) {
  const generateWaterfalls = useWaterfallStore(
    (state) => state.generateWaterfalls
  );

  const key = origin.toArray().join(",");
  const groundVersion = useStore((state) => state.grounds[key]?.version ?? 0);
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
    generateWaterfalls(origin);
  }, [groundVersion]);

  return (
    <>
      {waterfalls.map((waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
}
