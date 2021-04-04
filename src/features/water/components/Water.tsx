import React from "react";
import _ from "lodash";
import { WaterChunk } from "./WaterChunk";
import { observer } from "mobx-react-lite";
import { useGroundStore } from "StoreProvider";

export const Water = observer(() => {
  const groundStore = useGroundStore();
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