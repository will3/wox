import { Vector3 } from "three";

type MeshData = {
  vertices: number[];
  colors: number[];
  indices: number[];
  normals: number[];
  voxelIndexes: number[];
  voxelNormals: number[];
  voxelCount: number;
};

export default MeshData;
