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
  size: Vector3;
  sunColor: Color;
  ambient: Color;
  groundCurve: Curve;
  grounds: { [id: string]: GroundData };
  addGrounds(origins: Vector3[]): void;
  incrementGroundVersion(id: string): void;
  seed: string;
  maxHeight: number;
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
  size: new Vector3(5, 2, 5),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
  groundCurve: new Curve([-1, -0.4, 0.5, 2], [-1, -0.45, -0.35, 1.5]),
  grounds: {},
  addGrounds(origins: Vector3[]) {
    const grounds = { ...get().grounds };

    for (const origin of origins) {
      const key = origin.toArray().join(",");
      if (grounds[key] == null) {
        grounds[key] = {
          key,
          origin,
          version: 0,
        };
      }
    }

    set({ grounds });
  },
  incrementGroundVersion(id: string) {
    const grounds = { ...get().grounds };
    grounds[id].version++;

    set({ grounds });
  },
  seed: "1337",
  maxHeight: 64,
}));
