import { gridStore } from "features/grid/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { structoreStore } from "../store";

export const PlaceStructure = observer(() => {
  const gridIds = gridStore.gridIds;

  const handleMouseDown = (e: MouseEvent) => {
    console.log(`add structure ${gridIds}`);
    if (e.button !== 0) {
      return;
    }

    if (gridIds.length != 4) {
      return;
    }

    structoreStore.addStructure(gridIds);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gridIds]);

  return null;
});
