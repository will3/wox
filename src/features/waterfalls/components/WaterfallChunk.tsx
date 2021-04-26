import { Waterfall } from "./Waterfall";
import { useEffect, useMemo } from "react";
import React from "react";
import { observer } from "mobx-react-lite";
import { useChunksStore, useGroundStore, useWaterfallStore } from "StoreProvider";
import { GroundData } from "features/ground/store";

interface WaterfallChunkProps {
  ground: GroundData;
}

export const WaterfallChunk = observer(({ ground }: WaterfallChunkProps) => {
  const origin = ground.origin;
  const key = origin.toArray().join(",");
  const waterfallStore = useWaterfallStore();
  const waterfallIds = waterfallStore.waterfallChunks[key].waterfallIds;
  const waterfalls = useMemo(() => waterfallIds.map((id) => waterfallStore.waterfalls[id]), [
    waterfallIds,
  ]);
  const chunksStore = useChunksStore();
  const chunkVersion = chunksStore.getChunkVersion(ground.chunkId);

  useEffect(() => {
    if (chunkVersion === 1) {
      waterfallStore.generateWaterfalls(origin);
    }
  }, [chunkVersion]);

  return (
    <>
      {waterfalls.map((waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
});
