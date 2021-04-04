import React, { useEffect } from "react";
import _ from "lodash";
import { GroundChunk } from "./GroundChunk";
import { useChunks } from "features/chunks/hooks/useChunks";
import { observer } from "mobx-react-lite";
import Layers from "features/chunks/Layers";
import { useGroundStore } from "StoreProvider";

export const Ground = observer(() => {
  const groundStore = useGroundStore();
  const grounds = groundStore.grounds;
  const chunks = useChunks();
  const origins = groundStore.origins;

  useEffect(() => {
    groundStore.addGrounds(origins);
  }, [origins]);

  useEffect(() => {
    (async () => {
      await groundStore.generateAllChunks(chunks[Layers.ground]);
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
