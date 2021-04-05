import React, { useEffect } from "react";
import _ from "lodash";
import { GroundChunk } from "./GroundChunk";
import { observer } from "mobx-react-lite";
import { useGroundStore } from "StoreProvider";

export const Ground = observer(() => {
  const groundStore = useGroundStore();
  const grounds = groundStore.grounds;
  const groundChunks = groundStore.chunks;
  const origins = groundStore.origins;

  useEffect(() => {
    groundStore.addGrounds(origins);
  }, [origins]);

  useEffect(() => {
    (async () => {
      await groundStore.generateAllChunks(groundChunks);
    })();
  }, [origins]);

  return (
    <>
      {_.map(grounds, (ground) => (
        <GroundChunk key={ground.key} origin={ground.origin} id={ground.key} />
      ))}
    </>
  );
});
