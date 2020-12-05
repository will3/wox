import React from "react";
import _ from "lodash";
import { TreeChunk } from "./TreeChunk";
import { useGroundStore } from "features/ground/store";

export default function Trees() {
  const grounds = useGroundStore((state) => state.grounds);

  return (
    <>
      {_.map(grounds, (ground) => {
        return (
          <TreeChunk
            key={ground.origin.toArray().join(",")}
            origin={ground.origin}
            version={ground.version}
          />
        );
      })}
    </>
  );
}
