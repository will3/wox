import SimplexNoise from "simplex-noise";
import { Vector3 } from "three";

export interface NoiseOptions {
  seed?: SimplexNoise.RandomNumberGenerator | string;
  frequency?: number;
  scale?: Vector3;
  type?: NoiseType;
  octaves?: number;
  persistence?: number;
  lacunarity?: number;
}

export enum NoiseType {
  fbm
}

export class Noise {
  seed: SimplexNoise.RandomNumberGenerator | string;
  frequency: number;
  scale: Vector3;
  type: NoiseType;
  octaves: number;
  persistence: number;
  lacunarity: number;

  noise: SimplexNoise;
  constructor(options?: NoiseOptions) {
    this.seed = options?.seed || Math.random;
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
