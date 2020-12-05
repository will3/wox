import create from "zustand";

export interface StructureData {
  id: string;
  gridIds: string[];
}

export interface StructureState {
  structures: { [id: string]: StructureData };
  addStructure(gridIds: string[]): void;
}

export const useStructureStore = create<StructureState>((set, get) => ({
  structures: {},
  addStructure(gridIds: string[]) {
    const structures = { ...get().structures };
    const id = gridIds[0];
    const structure = {
      id,
      gridIds,
    };
    structures[id] = structure;
    set({ structures });
  },
}));
