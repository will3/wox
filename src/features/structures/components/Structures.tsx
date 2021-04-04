import React from "react";
import _ from "lodash";
import Structure from "./Structure";
import { PlaceStructure } from "./PlaceStructure";
import { structoreStore } from "../store";
import { observer } from "mobx-react-lite";

export interface StructuresProps {
  placeStructures?: boolean;
}
export const Structures = observer(({ placeStructures }: StructuresProps) => {
  const structures = structoreStore.structures;

  return (
    <>
      {placeStructures && <PlaceStructure />}
      {_.map(structures, (structure) => (
        <Structure key={structure.id} gridIds={structure.gridIds} />
      ))}
    </>
  );
});
