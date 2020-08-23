import { Euler } from "three";

export const lerp = (a: number, b: number, r: number) => {
  return a + (b - a) * r;
};

export const lerpEulers = (a: Euler, b: Euler, r: number) => {
  return new Euler(
    lerp(a.x, b.x, r),
    lerp(a.y, b.y, r),
    lerp(a.z, b.z, r),
    a.order
  );
};
