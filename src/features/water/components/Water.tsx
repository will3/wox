import React from "react";
import _ from "lodash";
import { WaterChunk } from "./WaterChunk";
import { groundStore } from "features/ground/store";

export default function Water() {
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
}
