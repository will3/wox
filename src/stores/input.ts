import create from "zustand";
import { Vector2 } from "three";
import { HoverState } from "../HoverState";

export interface InputState {
  mouse: Vector2;
  setMouse(mouse: Vector2): void;
  hover: HoverState | null;
  setHover(hover: HoverState | null): void;
}

export const useInputStore = create<InputState>((set) => ({
  mouse: new Vector2(),
  setMouse: (mouse: Vector2) => {
    set({ mouse });
  },
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
}));
