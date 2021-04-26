import { useEffect, useRef } from "react";
import { Chunks } from "./components/Chunks";
import React from "react";
import { observer } from "mobx-react-lite";
import { useChunksStore } from "StoreProvider";

export const Mesher = observer(() => {
  const ref = useRef<number>();
  const chunksStore = useChunksStore();

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
    for (const chunks of chunksStore.chunksList) {
      for (const chunk of chunks.chunks) {
        if (chunk.hidden) {
          continue;
        }
        if (chunks.onlyGrounded && chunk.groups.length === 0) {
          continue;
        }
        let changed = false;
        if (chunk.dirty) {
          chunksStore.updateMeshData(chunk);
          chunk.dirty = false;
          changed = true;
        }

        if (changed) {
          chunksStore.incrementChunksVersion(chunks.id);
        }
      }
    }
  };

  return (
    <>
      {chunksStore.chunksList.map((chunks, index) => (
        <Chunks key={index} chunks={chunks} />
      ))}
    </>
  );
});
