import _ from "lodash";
import { Vector2 } from "three";
import { useEffect } from "react";
import React from "react";
import { chunkSize } from "../../../constants";
import GridChunk from "./GridChunk";
import { useGridStore } from "../store";
import { useGroundStore } from "features/ground/store";

export default function Grids() {
  const size = useGroundStore((state) => state.size);
  const gridColumns = useGridStore((state) => state.gridColumns);
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
      {_(gridColumns)
        .map((column) => <GridChunk key={column.id} origin={column.origin} />)
        .value()}
    </>
  );
}
