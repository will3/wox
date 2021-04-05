import ChunksData from "features/chunks/ChunksData";
import { makeAutoObservable } from "mobx";

export interface StructureData {
  id: string;
  gridIds: string[];
}

export class StructureStore {
  structures: { [id: string]: StructureData } = {};
  chunks: ChunksData;

  constructor(chunks: ChunksData) {
    makeAutoObservable(this);
    this.chunks = chunks;
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
