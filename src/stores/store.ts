import create from "zustand";
import { Vector3, Vector2, Color } from "three";
import { HoverState } from "../HoverState";
import Curve from "../utils/Curve";

export interface State {
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
  mouse: Vector2;
  setMouse(mouse: Vector2): void;
  hover: HoverState | null;
  setHover(hover: HoverState | null): void;
  sunColor: Color;
  ambient: Color;
  seed: string;
}

export interface GroundData {
  key: string;
  origin: Vector3;
  version: number;
}

export const useStore = create<State>((set, get) => ({
  lightDir: new Vector3(-1, -1, -1),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
  mouse: new Vector2(),
  setMouse: (mouse: Vector2) => {
    set({ mouse });
  },
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
  seed: "1337",
}));
