import create from "zustand";
import { Vector3 } from "three";

export interface SceneState {
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
}

export const useSceneStore = create((set) => ({
  lightDir: new Vector3(),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
}));
