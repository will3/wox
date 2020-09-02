import { VoxelInfo } from "./VoxelInfo";
import { FaceInfo } from "./FaceInfo";

export type MeshData = {
  vertices: number[];
  colors: number[];
  indices: number[];
  normals: number[];
  voxelIndexes: number[];
  voxelNormals: number[];
  voxelCount: number;
  faces: FaceInfo[];
  upFaces: number[];
  voxels: VoxelInfo[];
  ao: number[];
};
