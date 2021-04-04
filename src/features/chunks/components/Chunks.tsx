import React from "react";
import _ from "lodash";
import { Chunk } from "./Chunk";
import { useChunks } from "../hooks/useChunks";
import { observer } from "mobx-react-lite";
import { useChunksStore } from "StoreProvider";

export interface ChunksProps {
  layer: number;
}

export const Chunks = observer(({ layer }: ChunksProps) => {
  const chunksList = useChunks();
  const chunksStore = useChunksStore();
  const version = chunksStore.versions[layer];
  const chunks = chunksList[layer];

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        const key = chunk.origin.join(",");
        return <Chunk key={key} chunk={chunk} />;
      })}
    </>
  );
});
