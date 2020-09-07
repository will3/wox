import { useStore } from "../store";
import _ from "lodash";
import { Vector2, Vector3 } from "three";
import { useMemo, useEffect } from "react";
import React from "react";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import ChunksData from "../Chunks/ChunksData";

export default function Grid() {
  const size = useStore((state) => state.size);
  const groundChunks = useStore((state) => state.chunks[Layers.ground]);

  const columns = useMemo(() => {
    const columns = [];
    for (let i = 0; i < size.x; i++) {
      for (let k = 0; k < size.z; k++) {
        columns.push(new Vector2(i, k).multiplyScalar(chunkSize));
      }
    }
    return columns;
  }, [size]);

  return (
    <>
      {columns.map((column) => (
        <GridChunk
          key={column.toArray().join(",")}
          origin={column}
          size={size}
          groundChunks={groundChunks}
        />
      ))}
    </>
  );
}

interface GridChunkProps {
  origin: Vector2;
  size: Vector3;
  groundChunks: ChunksData;
}

export interface GridData {
  origin: Vector2;
  coords: Vector3[];
}

export const gridSize = 4;

function GridChunk({ origin, size, groundChunks }: GridChunkProps) {
  console.log(`Grid chunk ${origin.toArray().join(",")}`);

  const setGrids = useStore((state) => state.setGrids);

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
        const coord = voxel.coord;
        const go = new Vector2(
          Math.floor(coord.x / gridSize) * gridSize,
          Math.floor(coord.z / gridSize) * gridSize
        );
        const key = go.toArray().join(",");
        if (grids[key] == null) {
          grids[key] = {
            origin: go,
            coords: [],
          };
        }
        grids[key].coords.push(coord);
      }
    }

    setGrids(origin, grids);
  }, []);

  return null;
}
