import { Vector3 } from "three";
import { FaceInfo } from "./features/chunks/FaceInfo";
import { VoxelInfo } from "./features/chunks/VoxelInfo";

export interface HoverState {
  coord: [number, number, number];
  layer: number;
  face: FaceInfo;
  voxel: VoxelInfo;
}
