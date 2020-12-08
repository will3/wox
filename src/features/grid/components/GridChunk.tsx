import { Vector2, Vector3 } from "three";
import { useCallback, useEffect } from "react";
import { chunkSize } from "../../../constants";
import _ from "lodash";
import { GridData, useGridStore } from "../store";
import { useGroundStore } from "features/ground/store";
import { useChunks } from "features/chunks/hooks/useChunks";
import Layers from "features/chunks/Layers";
import { useWaterStore } from "features/water/water";
import { gridSize } from "../constants";

interface GridChunkProps {
  origin: Vector2;
}

export default function GridChunk({ origin }: GridChunkProps) {
  const grounds = useGroundStore((state) => state.grounds);
  const chunks = useChunks();
  const groundChunks = chunks[Layers.ground];
  const waterLevel = useWaterStore((state) => state.waterLevel);
  const setGrids = useGridStore((state) => state.setGrids);

  const generated = useGroundStore(
    useCallback(
      (state) => {
        for (let j = 0; j < state.size.y; j++) {
          const co = new Vector3(origin.x, j * chunkSize, origin.y);
          const key = co.toArray().join(",");
          const ground = state.grounds[key];
          if (ground.version === 0) {
            return false;
          }
        }

        return true;
      },
      [grounds]
    )
  );

  const generateGrids = () => {
    const size = useGroundStore.getState().size;
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

    const key = origin.toArray().join(",");
    setGrids(key, _.values(grids));
  };

  useEffect(() => {
    if (!generated) {
      return;
    }

    generateGrids();
  }, [generated]);

  return null;
}
