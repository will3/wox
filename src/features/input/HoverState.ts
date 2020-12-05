import { Vector3 } from "three";
import { FaceInfo } from "../chunks/FaceInfo";
import { VoxelInfo } from "../chunks/VoxelInfo";

export interface HoverState {
  coord: [number, number, number];
  layer: number;
  face: FaceInfo;
  voxel: VoxelInfo;
}
