import React, { useEffect, useMemo } from "react";
import { useGroundStore } from "../store";
import _ from "lodash";
import { GroundChunk } from "./GroundChunk";
import { useChunks } from "features/chunks/hooks/useChunks";
import { useOrigins } from "../hooks/useOrigins";
import { useSortedColumns } from "../hooks/useSortedColumns";
import { useNoise } from "../hooks/useNoise";

export function Ground() {
  const grounds = useGroundStore((state) => state.grounds);
  const addGrounds = useGroundStore((state) => state.addGrounds);
  const chunks = useChunks();
  const origins = useOrigins();
  const sortedColumns = useSortedColumns();
  const generateColumns = useGroundStore(state => state.generateColumns);
  const noise = useNoise();

  useEffect(() => {
    addGrounds(origins);
  }, [origins]);

  useEffect(() => {
    (async () => {
      await generateColumns(sortedColumns, chunks, noise);
    })();
  }, [sortedColumns]);

  return (
    <>
      {_.map(grounds, (ground) => (
        <GroundChunk key={ground.key} origin={ground.origin} id={ground.key} />
      ))}
    </>
  );
}
