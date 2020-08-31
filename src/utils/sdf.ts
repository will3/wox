import { Vector3, Vector2, Matrix4 } from "three";
import { clamp } from "lodash";

export const sdVerticalCapsule = (p: Vector3, h: number, r: number): number => {
  p = p.clone();
  p.y -= clamp(p.y, 0.0, h);
  return p.length() - r;
};

export const sdCone = (p: Vector3, c: Vector2, h: number): number => {
  const q = Math.sqrt(p.x * p.x + p.z * p.z);
  return Math.max(new Vector2(c.x, c.y).dot(new Vector2(q, p.y)), -h - p.y);
};

export const opTx = (p: Vector3, t: Matrix4): Vector3 => {
  return p.clone().applyMatrix4(new Matrix4().getInverse(t));
};
