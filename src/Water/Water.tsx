import React from "react";
import _ from "lodash";
import { useStore } from "../stores/store";
import { WaterChunk } from "./WaterChunk";

export default function Water() {
  const grounds = useStore((state) => state.grounds);

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
