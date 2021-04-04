import { useEffect } from "react";
import placeStructure from "../placeStructure";
import { useChunks } from "features/chunks/hooks/useChunks";
import { useGridStore } from "StoreProvider";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const gridStore = useGridStore();
  const grids = gridStore.grids;
  const chunks = useChunks();

  useEffect(() => {
    const gs = gridIds.map((x) => grids[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
