import React, { Component } from "react";
import _ from "lodash";
import Chunk from "./Chunk";
import ChunksData from "./ChunksData";

export default class Chunks extends Component {
  chunksData = new ChunksData();

  get chunks() {
    return this.chunksData;
  }

  render() {
    return (
      <>
        {_.values(this.chunksData.map).map((chunk) => {
          return <Chunk key={chunk.getKey()} chunk={chunk} />;
        })}
      </>
    );
  }
};
