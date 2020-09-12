import { Vector2, Vector3 } from "three";
import ChunksData from "../Chunks/ChunksData";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import { chunkSize } from "../constants";
import { gridSize } from "./constants";
import _ from "lodash";
import { useGridStore, GridColumnData, GridData } from "../stores/grid";
import { useWaterStore } from "../stores/water";

interface GridChunkProps {
  origin: Vector2;
  size: Vector3;
  groundChunks: ChunksData;
  column: GridColumnData;
}

export default function GridChunk({
  origin,
  size,
  groundChunks,
  column,
}: GridChunkProps) {
  console.log(`Grid chunk ${origin.toArray().join(",")}`);

  const setGrids = useGridStore((state) => state.setGrids);
  const waterLevel = useWaterStore((state) => state.waterLevel);

  useEffect(() => {
    const grids: { [id: string]: GridData } = {};

    for (let j = 0; j < size.y; j++) {
      const co = new Vector3(origin.x, j * chunkSize, origin.y);
      const chunk = groundChunks.getChunk(
        co.toArray() as [number, number, number]
      );
      const meshData = chunk.meshData!;

      for (const faceIndex of meshData.upFaces) {
        const face = meshData.faces[faceIndex];
        const voxel = meshData.voxels[face.voxelIndex];
        const coord = new Vector3().fromArray(voxel.coord).add(co);
        if (coord.y <= waterLevel) {
          continue;
        }
        const go = new Vector2(
          Math.floor(coord.x / gridSize) * gridSize,
          Math.floor(coord.z / gridSize) * gridSize
        );
        const key = go.toArray().join(",");
        if (grids[key] == null) {
          grids[key] = {
            id: go.toArray().join(","),
            origin: go,
            coords: [],
            minY: 0,
            maxY: 0,
          };
        }
        grids[key].coords.push(coord);
      }
    }

    for (const key in grids) {
      const grid = grids[key];
      const ys = grid.coords.map((g) => g.y);
      grid.minY = _(ys).min() || 0;
      grid.maxY = _(ys).max() || 0;
    }

    setGrids(column.id, _.values(grids));
  }, []);

  return null;
}
