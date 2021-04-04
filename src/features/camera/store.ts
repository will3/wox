import { groundStore } from "features/ground/store";
import create from "zustand";
import { chunkSize } from "../../constants";
import { EulerValue, Vector3Value } from "../../utils/math";

export interface CameraState {
  targetRotation: EulerValue;
  target: Vector3Value;
  distance: number;
  setTargetRotation(targetRotation: EulerValue): void;
  setDistance(distance: number): void;
}

const initialRotation: EulerValue = [-Math.PI / 4, Math.PI / 4, 0, "YXZ"];

const size = groundStore.size;

const target: Vector3Value = [
  (size.x * chunkSize) / 2,
  ((size.y - 1) * chunkSize) / 2,
  (size.z * chunkSize) / 2,
];

export const useCameraStore = create<CameraState>((set) => ({
  rotation: initialRotation,
  targetRotation: initialRotation,
  target,
  distance: 400,
  setTargetRotation(targetRotation: EulerValue) {
    set({ targetRotation });
  },
  setDistance(distance: number) {
    set({ distance });
  },
}));
