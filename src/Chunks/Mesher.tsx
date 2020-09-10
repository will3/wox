import { useEffect, useRef } from "react";
import ChunksData from "./ChunksData";
import Chunks from "./Chunks";
import React from "react";
import { useStore } from "../stores/store";

export default function Mesher() {
  const chunksList = useStore((state) => state.chunks);
  const ref = useRef<number>();
  const waterLevel = useStore((state) => state.waterLevel);
  const incrementChunksVersion = useStore(
    (state) => state.incrementChunksVersion
  );

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
        const chunk = chunks.map[id];
        if (chunk.dirty) {
          chunk.updateMeshData(waterLevel);
          chunk.dirty = false;
        }
      }
    }
  };

  const processChunks = (chunks: ChunksData) => {
    if (!chunks.dirty) {
      return;
    }

    chunks.dirty = false;
    incrementChunksVersion(chunks.layer);
  };

  return (
    <>
      {chunksList.map((chunks, index) => (
        <Chunks key={index} layer={chunks.layer} />
      ))}
    </>
  );
}
