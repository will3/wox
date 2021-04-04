import create from "zustand";
import { Vector2, Vector3 } from "three";
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
}));
