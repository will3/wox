import React from "react";
import _ from "lodash";
import { WaterChunk } from "./WaterChunk";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";

export const Water = observer(() => {
  const grounds = groundStore.grounds;

  return (
    <>
      {_.map(grounds, (ground) => (
        <WaterChunk
          key={ground.key}
          origin={ground.origin}
          version={ground.version}
        />
      ))}
    </>
  );
});