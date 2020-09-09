import create from "zustand";
import { Euler, Vector3 } from "three";

export interface CameraState {
  camera: CameraData;
  setCamera(camera: CameraStateUpdate): void;
}

export interface CameraStateUpdate {
  rotation?: Euler;
  targetRotation?: Euler;
  target?: Vector3;
  distance?: number;
}

export interface CameraData {
  rotation: Euler;
  targetRotation: Euler;
  target: Vector3;
  distance: number;
}

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");

export const useCameraStore = create<CameraState>((set) => ({
  camera: {
    rotation: initialRotation,
    targetRotation: initialRotation,
    target: new Vector3(),
    distance: 400,
  },
  setCamera: (camera: CameraStateUpdate) =>
    set((state) => {
      const next: CameraData = { ...state.camera, ...camera };
      return { camera: next };
    }),
}));
