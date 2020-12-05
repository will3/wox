import { useEffect } from "react";
import { useStructureStore } from "./stores/structure";
import { useGridStore } from "./features/grid/store";

export default function PlaceStructure() {
  const gridIds = useGridStore((state) => state.gridIds);
  const addStructure = useStructureStore((state) => state.addStructure);

  const handleMouseDown = (e: MouseEvent) => {
    console.log(`add structure ${gridIds}`);
    if (e.button !== 0) {
      return;
    }

    if (gridIds.length != 4) {
      return;
    }

    addStructure(gridIds);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gridIds]);

  return null;
}
