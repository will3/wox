import React, { useEffect } from "react";
import _ from "lodash";
import { Vector3 } from "three";
import { chunkSize } from "../../../constants";
import { WaterfallChunk } from "./WaterfallChunk";
import { observer } from "mobx-react-lite";
import { useGroundStore, useWaterfallStore } from "StoreProvider";

export const Waterfalls = observer(() => {
  const groundStore = useGroundStore();
  const waterfallStore = useWaterfallStore();
  const size = groundStore.numChunks;
  const grounds = groundStore.grounds;

  useEffect(() => {
    const origins = [];
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.z; j++) {
        for (let k = 0; k < size.z; k++) {
          origins.push(new Vector3(i, j, k).multiplyScalar(chunkSize));
        }
      }
    }
    waterfallStore.setWaterfallChunks(origins);
  }, [size]);

  return (
    <>
      {_.map(grounds, (ground) => (
        <WaterfallChunk key={ground.key} ground={ground} />
      ))}
    </>
  );
});
