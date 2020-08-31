import React, { Component, useState } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";
import { useStore } from "../store";

export interface ChunksProps {
  chunksData: ChunksData;
}

export default ({ chunksData }: ChunksProps) => {
  const version = useStore(state => state.chunks.version);

  console.log(`Rerender chunks version: ${version}`);

  return (
    <>
      {_.values(chunksData.map).map((chunk) => {
        return <Chunk key={chunk.key} chunk={chunk} />;
      })}
    </>
  );
};
