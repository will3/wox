import create from "zustand";
import { Euler, Vector3 } from "three";
import { chunkSize } from "../constants";
import { useGroundStore } from "./ground";

export interface CameraState {
  targetRotation: Euler;
  target: Vector3;
  distance: number;
  setTargetRotation(targetRotation: Euler): void;
  setDistance(distance: number): void;
}

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");

const size = useGroundStore.getState().size;

const target = new Vector3(
  (size.x * chunkSize) / 2,
  ((size.y - 1) * chunkSize) / 2,
  (size.z * chunkSize) / 2
);

export const useCameraStore = create<CameraState>((set, get) => ({
  rotation: initialRotation,
  targetRotation: initialRotation,
  target,
  distance: 400,
  setTargetRotation(targetRotation: Euler) {
    set({ targetRotation });
  },
  setDistance(distance: number) {
    set({ distance });
  },
}));
