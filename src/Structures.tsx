import { useStore } from "./store";
import React from "react";
import _ from "lodash";
import Structure from "./Structure";

export default function Structures() {
  const houses = useStore((state) => state.houses);

  return (
    <>
      {_.map(houses.byId, (house) => (
        <Structure key={house.id} gridIds={house.gridIds} />
      ))}
    </>
  );
}
