import { makeAutoObservable } from "mobx";

export interface StructureData {
  id: string;
  gridIds: string[];
}

export class StructureStore {
  structures: { [id: string]: StructureData } = {};

  constructor() {
    makeAutoObservable(this);
  }

  addStructure(gridIds: string[]) {
    const id = gridIds[0];
    const structure = {
      id,
      gridIds,
    };
    this.structures[id] = structure;
  }
}

export const structoreStore = new StructureStore();