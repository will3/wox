import React, { useEffect, useRef, createRef } from "react";
import { Chunks, ChunksData, ChunkData } from "../Chunks";
import { Vector3 } from "three";
import { Noise } from "../Noise";
import { create } from "lodash";

export interface PlanetProps {
  size: [number, number, number];
  seed: number;
}

export default (props: PlanetProps) => {
  const { size, seed } = props;
  const maxHeight = 64;

  const chunksRef = createRef<Chunks>();

  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
  });

  useEffect(() => {
    console.log(chunksRef.current);
    if (chunksRef.current == null) {
      return;
    }

    const chunks = chunksRef.current.chunks;
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        for (let k = 0; k < size[2]; k++) {
          const origin = [i, j, k].map((x) => x * chunks.size) as [
            number,
            number,
            number
          ];
          const chunk = chunks.getOrCreateChunk(origin);
          generateChunk(chunk);
        }
      }
    }
  }, [chunksRef.current, seed]);

  const generateChunk = (chunk: ChunkData) => {
    console.log(`Generated chunk ${chunk.getKey()}`)
    const origin = new Vector3().fromArray(chunk.origin);
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        const absY = origin.y + j;
        for (let k = 0; k < chunk.size; k++) {
          const gradient = (-absY / maxHeight) * 2 + 1;
          const position = new Vector3().fromArray([i, j, k]).add(origin);
          const v = noise.get(position) * 2 + gradient;
          chunk.set(i, j, k, v);
        }
      }
    }
  };

  return <Chunks ref={chunksRef} />;
};
