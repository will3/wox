import { useStore } from "./store";
import React from "react";
import _ from "lodash";
import Structure from "./Structure";

export default function Structures() {
  const structures = useStore((state) => state.structures);

  return (
    <>
      {_.map(structures.byId, (structure) => (
        <Structure key={structure.id} gridIds={structure.gridIds} />
      ))}
    </>
  );
}
