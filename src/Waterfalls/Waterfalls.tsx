import React, { useEffect } from "react";
import _ from "lodash";
import { useWaterfallStore } from "../stores/waterfall";
import { Vector3 } from "three";
import { chunkSize } from "../constants";
import WaterfallChunk from "./WaterfallChunk";
import { useGroundStore } from "features/ground/store";

export default function Waterfalls() {
  const size = useGroundStore((state) => state.size);
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
}
