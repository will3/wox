import { useEffect, useRef } from "react";
import ChunksData from "./ChunksData";
import { Chunks } from "./components/Chunks";
import React from "react";
import { useChunks } from "./hooks/useChunks";
import { chunksStore } from "./store";
import { observer } from "mobx-react-lite";

export const Mesher = observer(() => {
  const chunksList = useChunks();
  const ref = useRef<number>();

  const animate = () => {
    handleFrame();
    ref.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current != null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, []);

  const handleFrame = () => {
    for (const chunks of chunksList) {
      for (const id in chunks.map) {
        let changed = false;
        const chunk = chunks.map[id];
        if (chunk.dirty) {
          chunksStore.updateMeshData(chunksList, chunk.layer, chunk.key);
          chunk.dirty = false;
          changed = true;
        }

        if (changed) {
          chunksStore.incrementVersion(chunks.layer);
        }
      }
    }
  };

  return (
    <>
      {chunksList.map((chunks, index) => (
        <Chunks key={index} layer={chunks.layer} />
      ))}
    </>
  );
});
