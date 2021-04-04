import { useEffect } from "react";
import placeStructure from "../placeStructure";
import { useChunks } from "features/chunks/hooks/useChunks";
import { gridStore } from "features/grid/store";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = gridStore.grids;
  const chunks = useChunks();

  useEffect(() => {
    const gs = gridIds.map((x) => grids[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
