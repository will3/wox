import { Vector3 } from "three";
export interface Tree {
  normal: Vector3;
  size: number;
  position: Vector3;
  actualNormal?: Vector3;
}
