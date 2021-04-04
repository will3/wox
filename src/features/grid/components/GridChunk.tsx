import { Vector2, Vector3 } from "three";
import { useEffect, useMemo } from "react";
import { chunkSize } from "../../../constants";
import _ from "lodash";
import { GridData, gridStore } from "../store";
import { useChunks } from "features/chunks/hooks/useChunks";
import Layers from "features/chunks/Layers";
import { waterStore } from "features/water/store";
import { gridSize } from "../constants";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";

interface GridChunkProps {
  origin: Vector2;
}

export const GridChunk = observer(({ origin }: GridChunkProps) => {
  const chunks = useChunks();
  const groundChunks = chunks[Layers.ground];
  const waterLevel = waterStore.waterLevel;

  const generated = useMemo(() => {
    for (let j = 0; j < groundStore.size.y; j++) {
      const co = new Vector3(origin.x, j * chunkSize, origin.y);
      if (!groundStore.generatedOrigin(co)) {
        return false;
      }
    }

    return true;
  }, [groundStore.generatedOrigins]);

  const generateGrids = () => {
    const size = groundStore.size;
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
    gridStore.setGrids(key, _.values(grids));
  };

  useEffect(() => {
    if (!generated) {
      return;
    }

    generateGrids();
  }, [generated]);

  return null;
});
