import { Vector3 } from "three";
import { FaceInfo } from "./Chunks/FaceInfo";
import { VoxelInfo } from "./Chunks/VoxelInfo";

export interface HoverState {
  coord: [number, number, number];
  layer: number;
  face: FaceInfo;
  voxel: VoxelInfo;
}
