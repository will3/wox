import React, { useEffect } from "react";
import { groundStore } from "../store";
import _ from "lodash";
import { GroundChunk } from "./GroundChunk";
import { useChunks } from "features/chunks/hooks/useChunks";
import { useOrigins } from "../hooks/useOrigins";
import { useSortedColumns } from "../hooks/useSortedColumns";
import { observer } from "mobx-react-lite";

export const Ground = observer(() => {
  const grounds = groundStore.grounds;
  const chunks = useChunks();
  const origins = useOrigins();
  const sortedColumns = useSortedColumns();

  useEffect(() => {
    groundStore.addGrounds(origins);
  }, [origins]);

  useEffect(() => {
    (async () => {
      await groundStore.generateColumns(sortedColumns, chunks);
    })();
  }, [sortedColumns]);

  return (
    <>
      {_.map(grounds, (ground) => (
        <GroundChunk key={ground.key} origin={ground.origin} id={ground.key} />
      ))}
    </>
  );
});
