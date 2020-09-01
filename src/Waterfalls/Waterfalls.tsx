import { useStore } from "../store";
import React from "react";
import _ from "lodash";
import { Waterfall } from "./Waterfall";
import { WaterfallData } from "./WaterfallData";

export interface WaterfallsProps {
  waterfalls: { [key: string]: WaterfallData };
}

export default ({ waterfalls }: WaterfallsProps) => {
  return (
    <>
      {_.map(waterfalls, (waterfall) => (
        <Waterfall key={waterfall.key} data={waterfall} />
      ))}
    </>
  );
};
