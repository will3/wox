import { Color, Vector3 } from "three";
import create from "zustand";

export interface LightState {
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
  sunColor: Color;
  ambient: Color;
}

export const useLightStore = create<LightState>((set) => ({
  lightDir: new Vector3(-1, -1, -1),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
}));
