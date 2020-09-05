import { useStore } from "../store";
import React from "react";
import _ from "lodash";
import { Waterfall } from "./Waterfall";

export default () => {
  const waterfalls = useStore((state) => state.waterfalls);
  return (
    <>
      {_.map(waterfalls, (waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
};
