import React, { Component } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";

export interface ChunksProps {
  chunksData: ChunksData;
}

export default class Chunks extends Component<ChunksProps> {
  render() {
    return (
      <>
        {_.values(this.props.chunksData.map).map((chunk) => {
          return <Chunk key={chunk.getKey()} chunk={chunk} />;
        })}
      </>
    );
  }
}
