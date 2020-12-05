import create from "zustand";
import { Vector2, Vector3 } from "three";
import { useGroundStore } from "./ground";
import { chunkSize } from "../constants";
import { useChunkStore } from "../features/chunks/store";
import Layers from "../Layers";
import { gridSize } from "../Grid/constants";
import { useWaterStore } from "./water";
import _ from "lodash";

export interface GridData {
  id: string;
  origin: Vector2;
  coords: Vector3[];
  minY: number;
  maxY: number;
}

export interface GridColumnData {
  id: string;
  origin: Vector2;
  gridIds: string[];
}

export interface GridState {
  grids: { [id: string]: GridData };
  gridColumns: { [id: string]: GridColumnData };
  setGrids(columnId: string, grids: GridData[]): void;
  addGridColumns(origins: Vector2[]): void;
  gridIds: string[];
  setGridIds(gridIds: string[]): void;
  generateGrids(origin: Vector2): void;
}

export const useGridStore = create<GridState>((set, get) => ({
  setGrids(columnId: string, grids: GridData[]) {
    const existingGrids = { ...get().grids };
    for (const grid of grids) {
      existingGrids[grid.id] = grid;
    }
    set({ grids: existingGrids });

    const gridColumns = { ...get().gridColumns };
    gridColumns[columnId].gridIds = grids.map((x) => x.id);
    set({ gridColumns });
  },
  addGridColumns(origins: Vector2[]) {
    const gridColumns = { ...get().gridColumns };
    for (const origin of origins) {
      const id = origin.toArray().join(",");
      gridColumns[id] = {
        id,
        origin,
        gridIds: [],
      };
    }
    set({ gridColumns });
  },
  grids: {},
  gridColumns: {},
  gridIds: [],
  setGridIds(gridIds: string[]) {
    set({ gridIds });
  },
  generateGrids(origin: Vector2) {
    const size = useGroundStore.getState().size;
    const groundChunks = useChunkStore.getState().chunks[Layers.ground];
    const waterLevel = useWaterStore.getState().waterLevel;
    const setGrids = get().setGrids;
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
  },
}));
