import React from "react";
import { Chunks, ChunksData, ChunkData } from "../Chunks";
import SimplexNoise from "simplex-noise";
import { Vector3 } from "three";

export interface PlanetProps {
  size: [number, number, number];
}

export default (props: PlanetProps) => {
  const { size } = props;
  const chunks = new ChunksData();
  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
  });
  const maxHeight = size[1] * chunks.size;

  const generateChunk = (chunk: ChunkData) => {
    const origin = new Vector3().fromArray(chunk.origin);
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        const absY = origin.y + j;
        for (let k = 0; k < chunk.size; k++) {
          const gradient = (-absY / maxHeight) * 2 + 1;
          const position = new Vector3().fromArray([i, j, k]).add(origin);
          const v = noise.get(position) + gradient;
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

interface NoiseOptions {
  seed?: string;
  frequency?: number;
  scale?: Vector3;
  type?: NoiseType;
  octaves?: number;
  persistence?: number;
  lacunarity?: number;
}

class Noise {
  seed: string;
  frequency: number;
  scale: Vector3;
  type: NoiseType;
  octaves: number;
  persistence: number;
  lacunarity: number;

  noise: SimplexNoise;
  constructor(options?: NoiseOptions) {
    this.seed = options?.seed || "1337";
    this.frequency = options?.frequency || 0.01;
    this.scale = options?.scale || new Vector3(1, 1, 1);
    this.type = options?.type || NoiseType.fbm;
    this.octaves = options?.octaves || 5;
    this.persistence = options?.persistence || 0.5;
    this.lacunarity = options?.lacunarity || 2;

    this.noise = new SimplexNoise(this.seed);
  }

  get(coord: Vector3) {
    switch (this.type) {
      case NoiseType.fbm:
        return this.getFbm(coord);
    }
  }

  getFbm(coord: Vector3) {
    let v = 0;
    let a = 1;
    let f = this.frequency;

    for (let i = 0; i < this.octaves; i++) {
      v += this.getSimplex(coord, f) * a;
      f *= this.lacunarity;
      a *= this.persistence;
    }

    return v;
  }

  getSimplex(coord: Vector3, frequency: number) {
    const c = coord.clone().multiplyScalar(frequency).multiply(this.scale);
    return this.noise.noise3D(c.x, c.y, c.z);
  }
}

enum NoiseType {
  fbm,
}
