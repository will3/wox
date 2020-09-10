import { useEffect, useRef } from "react";
import ChunksData from "./ChunksData";
import Chunks from "./Chunks";
import React from "react";
import { useStore } from "../stores/store";
import { useChunkStore } from "../stores/chunk";

export default function Mesher() {
  const chunksList = useChunkStore((state) => state.chunks);
  const ref = useRef<number>();
  const waterLevel = useStore((state) => state.waterLevel);
  const incrementVersion = useChunkStore((state) => state.incrementVersion);
  const updateMeshData = useChunkStore((state) => state.updateMeshData);

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
    for (let chunks of chunksList) {
      processChunks(chunks);

      for (let id in chunks.map) {
        let changed = false;
        const chunk = chunks.map[id];
        if (chunk.dirty) {
          updateMeshData(chunk.layer, chunk.key);
          chunk.dirty = false;
          changed = true;
        }

        if (changed) {
          incrementVersion(chunks.layer);
        }
      }
    }
  };

  const processChunks = (chunks: ChunksData) => {
    if (!chunks.dirty) {
      return;
    }

    chunks.dirty = false;
  };

  return (
    <>
      {chunksList.map((chunks, index) => (
        <Chunks key={index} layer={chunks.layer} />
      ))}
    </>
  );
}
