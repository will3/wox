import create from "zustand";
import { Vector2, Vector3 } from "three";
import _ from "lodash";
import { makeAutoObservable } from "mobx";

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

export class GridStore {
  grids: { [id: string]: GridData } = {};
  gridColumns: { [id: string]: GridColumnData } = {};
  gridIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setGridIds(gridIds: string[]) {
    this.gridIds = gridIds;
  }

  setGrids(columnId: string, grids: GridData[]) {
    for (const grid of grids) {
      this.grids[grid.id] = grid;
    }

    this.gridColumns[columnId].gridIds = grids.map((x) => x.id);
  }

  addGridColumns(origins: Vector2[]) {
    for (const origin of origins) {
      const id = origin.toArray().join(",");
      this.gridColumns[id] = {
        id,
        origin,
        gridIds: [],
      };
    }
  }
}
