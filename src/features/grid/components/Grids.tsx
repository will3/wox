import _ from "lodash";
import { Vector2 } from "three";
import { useEffect } from "react";
import React from "react";
import { chunkSize } from "../../../constants";
import { GridChunk } from "./GridChunk";
import { HighlightGrid } from "./HighlightGrid";
import { observer } from "mobx-react-lite";
import { useGridStore, useGroundStore } from "StoreProvider";

export interface GridsProps {
  highlightGrid?: boolean;
}

export const Grids = observer(({ highlightGrid }: GridsProps) => {
  const groundStore = useGroundStore();
  const size = groundStore.numChunks;
  const gridStore = useGridStore();
  const gridColumns = gridStore.gridColumns;

  useEffect(() => {
    const columns = [];
    for (let i = 0; i < size.x; i++) {
      for (let k = 0; k < size.z; k++) {
        columns.push(new Vector2(i, k).multiplyScalar(chunkSize));
      }
    }
    gridStore.addGridColumns(columns);
  }, [size]);

  return (
    <>
      {highlightGrid && <HighlightGrid />}
      {_(gridColumns)
        .map((column) => <GridChunk key={column.id} origin={column.origin} />)
        .value()}
    </>
  );
});
