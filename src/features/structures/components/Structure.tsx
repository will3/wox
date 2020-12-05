import { useEffect } from "react";
import placeStructure from "../placeStructure";
import { useGridStore } from "features/grid/store";
import { useChunkStore } from "features/chunks/store";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = useGridStore((state) => state.grids);
  const chunks = useChunkStore((state) => state.chunks);

  useEffect(() => {
    const gs = gridIds.map((x) => grids[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
