import React, { Component, useState } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";
import { useFrame } from "react-three-fiber";

export interface ChunksProps {
  chunksData: ChunksData;
}

export default ({ chunksData }: ChunksProps) => {
  const [counter, setCounter] = useState(0);

  useFrame(() => {
    if (!chunksData.dirty) {
      return;
    }

    setCounter(counter + 1);
    chunksData.dirty = false;
  });

  return (
    <>
      {_.values(chunksData.map).map((chunk) => {
        return <Chunk key={chunk.getKey()} chunk={chunk} />;
      })}
    </>
  );
};
