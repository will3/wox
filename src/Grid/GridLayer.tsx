import { useStore } from "../store";
import _ from "lodash";
import { Vector2 } from "three";
import { useEffect } from "react";
import React from "react";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import GridChunk from "./GridChunk";

export default function GridLayer() {
  const size = useStore((state) => state.size);
  const gridColumns = useStore((state) => state.gridColumns);
  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const addGridColumns = useStore((state) => state.addGridColumns);

  useEffect(() => {
    const columns = [];
    for (let i = 0; i < size.x; i++) {
      for (let k = 0; k < size.z; k++) {
        columns.push(new Vector2(i, k).multiplyScalar(chunkSize));
      }
    }
    addGridColumns(columns);
  }, [size]);

  return (
    <>
      {_(gridColumns.byId)
        .map((column) => (
          <GridChunk
            key={column.id}
            origin={column.origin}
            size={size}
            groundChunks={groundChunks}
            column={column}
          />
        ))
        .value()}
    </>
  );
}
