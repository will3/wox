import React from "react";
import _ from "lodash";
import { TreeChunk } from "./TreeChunk";
import { groundStore } from "features/ground/store";
import { observer } from "mobx-react-lite";

export const Trees = observer(() => {
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
});
