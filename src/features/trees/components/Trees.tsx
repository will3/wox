import React from "react";
import _ from "lodash";
import { TreeChunk } from "./TreeChunk";
import { observer } from "mobx-react-lite";
import { useGroundStore } from "StoreProvider";

export const Trees = observer(() => {
  const groundStore = useGroundStore();
  const grounds = groundStore.grounds;

  return (
    <>
      {_.map(grounds, (ground) => {
        return (
          <TreeChunk
            key={ground.key}
            ground={ground}
          />
        );
      })}
    </>
  );
});
