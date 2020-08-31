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
          const start = new Date().getTime();
          chunk.meshData = meshChunk(chunk);
          const end = new Date().getTime();

          console.log(
            `Meshed ${chunk.layer} ${chunk.origin.join(",")} ${
              chunk.meshData.vertices.length / 3
            } vertices, ${chunk.meshData.indices.length / 3} triangles ${
              end - start
            }ms`
          );

          chunk.version++;
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
