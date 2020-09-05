import { VoxelInfo } from "../Chunks/VoxelInfo";
import { Vector3 } from "three";
import ChunksData from "../Chunks/ChunksData";
import placeTree from "../Trees/placeTree";
import Layers from "../Layers";

export default (chunks: ChunksData[], coord: Vector3, voxel: VoxelInfo) => {
    placeTree(chunks[Layers.trees], coord, voxel.voxelNormal, 1);
};