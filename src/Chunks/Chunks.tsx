import React from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";

export interface ChunksProps {
  chunks: ChunksData;
}

export default (props: ChunksProps) => {
  const { chunks } = props;
  return (
    <>
      {_.values(chunks.map).map((chunk) => {
        return <Chunk key={chunk.getKey()} chunk={chunk} />;
      })}
    </>
  );
};
