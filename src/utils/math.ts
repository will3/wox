import { Vector3, Quaternion } from "three";

export type EulerValue = [number, number, number, string];
export type Vector3Value = [number, number, number];

export const lerp = (a: number, b: number, r: number) => {
  return a + (b - a) * r;
};

export const lerpEulers = (
  a: EulerValue,
  b: EulerValue,
  r: number
): EulerValue => {
  return [lerp(a[0], b[0], r), lerp(a[1], b[1], r), lerp(a[2], b[2], r), a[3]];
};

export const clamp = (v: number, min: number, max: number) => {
  if (v < min) {
    return min;
  }
  if (v > max) {
    return max;
  }
  return v;
};

export const calcSphereStroke = (radius: number) => {
  const r = Math.ceil(radius);

  const result = [];
  for (let i = -r; i <= r; i++) {
    for (let j = -r; j <= r; j++) {
      for (let k = -r; k <= r; k++) {
        const dis = Math.sqrt(i * i + j * j + k * k);
        const value = 1 - dis / radius;
        if (value < 0) {
          continue;
        }
        result.push({
          coord: new Vector3(i, j, k),
          value,
        });
      }
    }
  }

  return result;
};

export const randomVector = (rng: seedrandom.prng) => {
  const a = 2 * Math.PI * rng();
  const z = rng() * 2 - 1;
  const r = Math.sqrt(1 - z * z);
  return new Vector3(r * Math.cos(a), r * Math.sin(a), z);
};

export const randomQuaternion = (rng: seedrandom.prng) => {
  return new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    randomVector(rng)
  );
};
