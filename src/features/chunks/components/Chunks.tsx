import React from "react";
import _ from "lodash";
import { Chunk } from "./Chunk";
import { observer } from "mobx-react-lite";
import { useChunksStore } from "StoreProvider";
import ChunksData from "../ChunksData";

export interface ChunksProps {
  chunks: ChunksData;
}

export const Chunks = observer(({ chunks }: ChunksProps) => {
  const chunksStore = useChunksStore();
  const version = chunksStore.getVersion(chunks.id);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {Array.from(chunks.chunks).map((chunk) => {
        const key = chunk.origin.join(",");
        return <Chunk key={key} chunk={chunk} />;
      })}
    </>
  );
});
