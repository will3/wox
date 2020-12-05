import { Vector3, Vector2, Matrix4 } from "three";
import { clamp } from "lodash";

type vec3 = Vector3;

const abs = (value: Vector3) => {
  return new Vector3(Math.abs(value.x), Math.abs(value.y), Math.abs(value.z));
};

const maxVector3 = (a: Vector3, b: number) => {
  return new Vector3(Math.max(a.x, b), Math.max(a.y, b), Math.max(a.z, b));
};

const max = Math.max;

const min = Math.min;

const length = (vector: Vector3) => {
  return vector.length();
};

export const opTx = (p: Vector3, t: Matrix4): Vector3 => {
  return p.clone().applyMatrix4(new Matrix4().getInverse(t));
};

export const sdVerticalCapsule = (p: Vector3, h: number, r: number): number => {
  p = p.clone();
  p.y -= clamp(p.y, 0.0, h);
  return p.length() - r;
};

export const sdCone = (p: Vector3, c: Vector2, h: number): number => {
  const q = Math.sqrt(p.x * p.x + p.z * p.z);
  return Math.max(new Vector2(c.x, c.y).dot(new Vector2(q, p.y)), -h - p.y);
};

export const sdBox = (p: vec3, b: vec3): number => {
  const q = new Vector3().subVectors(abs(p), b);
  return length(maxVector3(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
};

export const sdSphere = (p: vec3, s: number): number => {
  return length(p) - s;
};
