import React, { useEffect } from "react";
import _ from "lodash";
import { Vector3 } from "three";
import { chunkSize } from "../../../constants";
import { WaterfallChunk } from "./WaterfallChunk";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";
import { waterfallStore } from "../store";

export const Waterfalls = observer(() => {
  const size = groundStore.size;
  const waterfallChunks = waterfallStore.waterfallChunks;

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
      {_.map(waterfallChunks, (chunk) => (
        <WaterfallChunk key={chunk.key} origin={chunk.origin} />
      ))}
    </>
  );
});
