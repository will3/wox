import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useGridStore, useStructureStore } from "StoreProvider";

export const PlaceStructure = observer(() => {
  const gridStore = useGridStore();
  const gridIds = gridStore.gridIds;
  const structoreStore = useStructureStore();

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
