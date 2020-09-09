import { useEffect } from "react";
import placeStructure from "./Brushes/placeStructure";
import { useStore } from "./stores/store";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = useStore((state) => state.grids);
  const chunks = useStore((state) => state.chunks);

  useEffect(() => {
    const gs = gridIds.map((x) => grids.byId[x]);
    placeStructure(chunks, gs);
  }, []);
  return null;
}
