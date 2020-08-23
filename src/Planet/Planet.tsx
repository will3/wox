import React from "react";
import { Chunks, ChunksData, ChunkData } from "../Chunks";
import { Vector3 } from "three";
import { Noise } from "../Noise";

export interface PlanetProps {
  size: [number, number, number];
}

export default (props: PlanetProps) => {
  const { size } = props;
  const maxHeight = 64;
  const chunks = new ChunksData();
  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
  });

  const generateChunk = (chunk: ChunkData) => {
    const origin = new Vector3().fromArray(chunk.origin);
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        const absY = origin.y + j;
        for (let k = 0; k < chunk.size; k++) {
          const gradient = (-absY / maxHeight) * 2 + 1;
          const position = new Vector3().fromArray([i, j, k]).add(origin);
          const v = noise.get(position) * 2+ gradient ;
          chunk.set(i, j, k, v);
        }
      }
    }
  };

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

  return <Chunks chunks={chunks} />;
};
