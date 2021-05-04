import React from "react";
import _ from "lodash";
import { TreeChunk } from "./TreeChunk";
import { observer } from "mobx-react-lite";
import { useGroundStore } from "StoreProvider";
import { PlaceTree } from "./PlaceTree";

export const Trees = observer(() => {
  const groundStore = useGroundStore();
  const grounds = groundStore.grounds;

  return (
    <>
      <PlaceTree />
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
