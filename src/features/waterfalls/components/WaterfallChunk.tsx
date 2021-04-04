import { Waterfall } from "./Waterfall";
import { Vector3 } from "three";
import { useEffect, useMemo } from "react";
import React from "react";
import { useChunks } from "features/chunks/hooks/useChunks";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";
import { waterfallStore } from "../store";

interface WaterfallChunkProps {
  origin: Vector3;
}

export const WaterfallChunk = observer(({ origin }: WaterfallChunkProps) => {
  const chunks = useChunks();

  const key = origin.toArray().join(",");
  const groundVersion = groundStore.grounds[key]?.version ?? 0;
  const waterfallIds = waterfallStore.waterfallChunks[key].waterfallIds;
  const waterfalls = useMemo(() => waterfallIds.map((id) => waterfallStore.waterfalls[id]), [
    waterfallIds,
  ]);

  useEffect(() => {
    if (groundVersion === 0) {
      return;
    }
    waterfallStore.generateWaterfalls(chunks, origin);
  }, [groundVersion]);

  return (
    <>
      {waterfalls.map((waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
});
