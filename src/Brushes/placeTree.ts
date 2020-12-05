import { VoxelInfo } from "../features/chunks/VoxelInfo";
import { Vector3 } from "three";
import ChunksData from "../features/chunks/ChunksData";
import placeTree from "../Trees/placeTree";
import Layers from "../Layers";

export default (chunks: ChunksData[], coord: Vector3, voxel: VoxelInfo) => {
    placeTree(chunks[Layers.trees], coord, new Vector3().fromArray(voxel.voxelNormal), 1);
};