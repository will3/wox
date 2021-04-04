import React, { useEffect } from "react";
import _ from "lodash";
import { useWaterfallStore } from "../store";
import { Vector3 } from "three";
import { chunkSize } from "../../../constants";
import { WaterfallChunk } from "./WaterfallChunk";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";

export const Waterfalls = observer(() => {
  const size = groundStore.size;
  const setWaterfallChunks = useWaterfallStore(
    (state) => state.setWaterfallChunks
  );
  const waterfallChunks = useWaterfallStore((state) => state.waterfallChunks);

  useEffect(() => {
    const origins = [];
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.z; j++) {
        for (let k = 0; k < size.z; k++) {
          origins.push(new Vector3(i, j, k).multiplyScalar(chunkSize));
        }
      }
    }
    setWaterfallChunks(origins);
  }, [size]);

  return (
    <>
      {_.map(waterfallChunks, (chunk) => (
        <WaterfallChunk key={chunk.key} origin={chunk.origin} />
      ))}
    </>
  );
});
