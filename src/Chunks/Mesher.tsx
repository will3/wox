import { useStore } from "../store";
import { useEffect } from "react";
import { meshChunk } from "./meshChunk";
import { useFrame } from "react-three-fiber";
import ChunksData from "./ChunksData";

export default function Mesher() {
  const chunksList = useStore((state) => state.chunks);

  const handleFrame = () => {
    for (let chunks of chunksList) {
      processChunks(chunks);

      for (let id in chunks.map) {
        const chunk = chunks.map[id];
        if (chunk.dirty) {
          chunk.updateMeshData();
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

  useFrame(() => {
    handleFrame();
  });

  return null;
}
