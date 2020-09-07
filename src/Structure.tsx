import { useEffect } from "react";
import placeHouse from "./Brushes/placeHouse";
import { useStore } from "./store";

export interface StructureProps {
  gridIds: string[];
}

export default function Structure({ gridIds }: StructureProps) {
  const grids = useStore((state) => state.grids);
  const chunks = useStore((state) => state.chunks);

  useEffect(() => {
    const gs = gridIds.map((x) => grids.byId[x]);
    placeHouse(chunks, gs);
  }, []);
  return null;
}
