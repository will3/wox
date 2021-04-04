import React from "react";
import _ from "lodash";
import { TreeChunk } from "./TreeChunk";
import { groundStore } from "features/ground/store";

export default function Trees() {
  const grounds = groundStore.grounds;

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
