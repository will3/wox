import React from "react";
import _ from "lodash";
import Structure from "./Structure";
import { useStructureStore } from "./stores/structures";

export default function Structures() {
  const structures = useStructureStore((state) => state.structures);

  return (
    <>
      {_.map(structures.byId, (structure) => (
        <Structure key={structure.id} gridIds={structure.gridIds} />
      ))}
    </>
  );
}
