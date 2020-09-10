import { useStore } from "../stores/store";
import _ from "lodash";
import { Vector2 } from "three";
import { useEffect } from "react";
import React from "react";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import GridChunk from "./GridChunk";
import { useGridStore } from "../stores/grid";
import { useChunkStore } from "../stores/chunk";

export default function Grids() {
  const size = useStore((state) => state.size);
  const gridColumns = useGridStore((state) => state.gridColumns);
  const groundChunks = useChunkStore((state) => state.chunks[Layers.ground]);
  const addGridColumns = useGridStore((state) => state.addGridColumns);

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
