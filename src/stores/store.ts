import create from "zustand";
import { Vector3, Vector2, Color } from "three";
import { HoverState } from "../HoverState";
import Curve from "../utils/Curve";

export interface State {
  mouse: Vector2;
  setMouse(mouse: Vector2): void;
  hover: HoverState | null;
  setHover(hover: HoverState | null): void;
  seed: string;
}

export interface GroundData {
  key: string;
  origin: Vector3;
  version: number;
}

export const useStore = create<State>((set, get) => ({
  mouse: new Vector2(),
  setMouse: (mouse: Vector2) => {
    set({ mouse });
  },
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
  seed: "1237",
}));
