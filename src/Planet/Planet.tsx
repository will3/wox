import React, { useEffect, createRef } from "react";
import { Chunks, ChunkData } from "../Chunks";
import { Vector3 } from "three";
import { Noise } from "../Noise";
import { clamp } from "../math";

export interface PlanetProps {
  size: [number, number, number];
  seed: number;
}

export default (props: PlanetProps) => {
  const { size, seed } = props;
  const maxHeight = 64;
  const chunkSize = 32;

  const chunksRef = createRef<Chunks>();

  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
    seed: seed.toString(),
  });

  useEffect(() => {
    if (chunksRef.current == null) {
      return;
    }

    const chunks = chunksRef.current;

    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        for (let k = 0; k < size[2]; k++) {
          const origin = [i, j, k].map((x) => x * chunkSize) as [
            number,
            number,
            number
          ];
          const chunk = chunks.chunks.getOrCreateChunk(origin);
          generateChunk(chunk);
        }
      }
    }

    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        for (let k = 0; k < size[2]; k++) {
          const origin = [i, j, k].map((x) => x * chunkSize) as [
            number,
            number,
            number
          ];
          const chunk = chunks.chunks.getChunk(origin);
          generateGrass(chunk);
        }
      }
    }

    chunks.forceUpdate();
  }, [chunksRef.current, seed]);

  const rockColor: [number, number, number] = [0.1, 0.1, 0.08];
  const grassColor: [number, number, number] = [0.09, 0.12, 0.08];

  const generateChunk = (chunk: ChunkData) => {
    console.log(`Generated chunk ${chunk.getKey()}`);
    const origin = new Vector3().fromArray(chunk.origin);
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        const absY = origin.y + j;
        for (let k = 0; k < chunk.size; k++) {
          const gradient = ((-absY / maxHeight) * 2 + 1) * 0.75;
          const position = new Vector3().fromArray([i, j, k]).add(origin);
          const v = noise.get(position) + gradient;
          chunk.setColor(i, j, k, rockColor);
          chunk.set(i, j, k, v);
        }
      }
    }
  };

  const generateGrass = (chunk: ChunkData) => {
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          const normal = chunk.calcNormal(i, j, k);
          const dot = clamp(new Vector3(0, -1, 0).dot(normal), 0, 1);
          if (dot > 0.8) {
            chunk.setColor(i, j, k, grassColor);
          }
        }
      }
    }
  };

  return <Chunks ref={chunksRef} />;
};
