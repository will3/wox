import { useEffect } from "react";
import placeStructure from "../placeStructure";
import { useChunksStore, useGridStore, useStructureStore } from "StoreProvider";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const gridStore = useGridStore();
  const chunksStore = useChunksStore();
  const structureStore = useStructureStore();
  const structureChunks = structureStore.chunks;

  const grids = gridStore.grids;

  useEffect(() => {
    const gs = gridIds.map((x) => grids[x]);
    placeStructure(structureChunks, gs);
  }, []);
  return null;
}
