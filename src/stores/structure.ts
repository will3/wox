import create from "zustand";

export interface StructureData {
  id: string;
  gridIds: string[];
}

export interface StructureState {
  structures: { byId: { [id: string]: StructureData } };
  addStructure(structure: StructureData): void;
}

export const useStructureStore = create<StructureState>((set, get) => ({
  structures: { byId: {} },
  addStructure: (structure: StructureData) => {
    const id = structure.id;
    const structures = { ...get().structures };
    structures.byId[id] = structure;
    set({ structures: structures });
  },
}));
