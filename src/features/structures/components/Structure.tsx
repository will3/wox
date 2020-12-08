import { useEffect } from "react";
import placeStructure from "../placeStructure";
import { useGridStore } from "features/grid/store";
import { useChunks } from "features/chunks/hooks/useChunks";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = useGridStore((state) => state.grids);
  const chunks = useChunks();

  useEffect(() => {
    const gs = gridIds.map((x) => grids[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
