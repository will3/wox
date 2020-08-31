import React, { Component, useState } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";
import { useStore } from "../store";

export interface ChunksProps {
  layer: number;
}

export default ({ layer }: ChunksProps) => {
  const version = useStore(state => state.chunks[layer].version);
  const chunks = useStore(store => store.chunks[layer]);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        return <Chunk key={chunk.key} chunk={chunk} />;
      })}
    </>
  );
};
