import create from "zustand";
import { Euler, Vector3 } from "three";

export interface State {
  camera: CameraState;
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
  setCamera(camera: CameraStateUpdate): void;
}

export interface CameraStateUpdate {
  rotation?: Euler;
  targetRotation?: Euler;
  target?: Vector3;
  distance?: number;
}

export interface CameraState {
  rotation: Euler;
  targetRotation: Euler;
  target: Vector3;
  distance: number;
}

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");
export const useStore = create<State>((set) => ({
  camera: {
    rotation: initialRotation,
    targetRotation: initialRotation,
    target: new Vector3(),
    distance: 400,
  },
  lightDir: new Vector3(-1, -1, -1),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
  setCamera: (camera: CameraStateUpdate) =>
    set((state) => {
      const next: CameraState = { ...state.camera, ...camera };
      return { camera: next };
    }),
}));
