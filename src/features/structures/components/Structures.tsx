import React from "react";
import _ from "lodash";
import Structure from "./Structure";
import { useStructureStore } from "../store";
import PlaceStructure from "./PlaceStructure";

export interface StructuresProps {
  placeStructures?: boolean;
}
export default function Structures({ placeStructures }: StructuresProps) {
  const structures = useStructureStore((state) => state.structures);

  return (
    <>
      {placeStructures && <PlaceStructure />}
      {_.map(structures, (structure) => (
        <Structure key={structure.id} gridIds={structure.gridIds} />
      ))}
    </>
  );
}
