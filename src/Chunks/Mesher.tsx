import { useEffect, useRef } from "react";
import ChunksData from "./ChunksData";
import Chunks from "./Chunks";
import React from "react";
import { useStore } from "../store";

export interface MesherData {
  chunksList: ChunksData[];
}

export default function Mesher({ chunksList }: MesherData) {
  const ref = useRef<number>();
  const waterLevel = useStore((state) => state.waterLevel);

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
    chunks.version++;
  };

  return (
    <>
      {chunksList.map((chunks, index) => (
        <Chunks key={index} chunks={chunks} />
      ))}
    </>
  );
}
