import { Vector3 } from "three";
import create from "zustand";
import QuadMap from "../utils/QuadMap";

export interface TreeData {
  normal: Vector3;
  size: number;
  position: Vector3;
}

export interface TreeState {
  treeMap: QuadMap<TreeData>;
}

export const useTreeStore = create<TreeState>((set) => ({
  treeMap: new QuadMap(),
}));
