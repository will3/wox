import { useStore } from "./store";
import { useEffect } from "react";

export default function PlaceStructure() {
  const gridIds = useStore((state) => state.gridIds);
  const addHouse = useStore((state) => state.addHouse);

  const handleMouseDown = (e: MouseEvent) => {
    console.log(`add house ${gridIds}`);
    if (e.button !== 0) {
      return;
    }

    if (gridIds.length === 0) {
      return;
    }

    addHouse({
      id: gridIds[0],
      gridIds,
    });
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gridIds]);

  return null;
}
