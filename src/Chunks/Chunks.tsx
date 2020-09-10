import React, { useMemo } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";
import { useStore } from "../stores/store";

export interface ChunksProps {
  layer: number;
}

export default function Chunks({ layer }: ChunksProps) {
  const chunks = useStore((state) => state.chunks[layer]);
  const version = useStore((state) => state.chunksVersions[layer]);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        return <Chunk key={chunk.key} chunk={chunk} />;
      })}
    </>
  );
}
