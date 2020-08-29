import create from "zustand";
import { Euler, Vector3 } from "three";

interface CameraState {
  rotation: Euler;
  targetRotation: Euler;
  target: Vector3;
  distance: number;
  setTargetRotation(targetRotation: Euler): void;
  setRotation(Rotation: Euler): void;
  setDistance(distance: number): void;
  setTarget(target: Vector3): void;
}

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");
export const useCameraStore = create<CameraState>((set) => ({
  rotation: initialRotation,
  targetRotation: initialRotation,
  target: new Vector3(),
  distance: 400,
  setTargetRotation: (targetRotation: Euler) =>
    set({
      targetRotation,
    }),
  setRotation: (rotation: Euler) =>
    set({
      rotation,
    }),
  setDistance: (distance: number) =>
    set({
      distance,
    }),
  setTarget: (target: Vector3) =>
    set({
      target,
    }),
}));
