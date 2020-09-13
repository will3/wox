import React from "react";
import _ from "lodash";
import { WaterChunk } from "./WaterChunk";
import { useGroundStore } from "../stores/ground";

export default function Water() {
  const grounds = useGroundStore((state) => state.grounds);

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
