import React, { useMemo } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import { useChunkStore } from "../store";

export interface ChunksProps {
  layer: number;
}

export default function Chunks({ layer }: ChunksProps) {
  const chunks = useChunkStore((state) => state.chunks[layer]);
  const version = useChunkStore((state) => state.versions[layer]);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        return <Chunk key={chunk.key} chunk={chunk} />;
      })}
    </>
  );
}
