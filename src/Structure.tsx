import { useEffect } from "react";
import placeStructure from "./Brushes/placeStructure";
import { useStore } from "./stores/store";
import { useGridStore } from "./stores/grid";
import { useChunkStore } from "./stores/chunk";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = useGridStore((state) => state.grids);
  const chunks = useChunkStore((state) => state.chunks);

  useEffect(() => {
    const gs = gridIds.map((x) => grids.byId[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
