import React from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";
import { useStore } from "../store";

export interface ChunksProps {
  chunks: ChunksData;
}

export default function Chunks({ chunks }: ChunksProps) {
  const version = useStore((_) => chunks.version);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        return <Chunk key={chunk.key} chunk={chunk} />;
      })}
    </>
  );
}
