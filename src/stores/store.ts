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
  waterLevel: number;
  waterColor: Color;
  waterAlpha: number;
  groundCurve: Curve;
  grounds: { byId: { [id: string]: GroundData } };
  addGrounds(origins: Vector3[]): void;
  incrementGroundVersion(id: string): void;
  seed: string;
  maxHeight: number;
}

export interface GroundData {
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
  waterColor: new Color(0.08, 0.12, 0.2),
  waterAlpha: 0.4,
  waterLevel: 12,
  groundCurve: new Curve([-1, -0.4, 0.5, 2], [-1, -0.45, -0.35, 1.5]),
  grounds: {
    byId: {},
  },
  addGrounds(origins: Vector3[]) {
    const grounds = get().grounds;

    const byId = grounds.byId;
    for (const origin of origins) {
      const key = origin.toArray().join(",");
      if (byId[key] == null) {
        byId[key] = {
          origin,
          version: 0,
        };
      }
    }

    set({ grounds });
  },
  incrementGroundVersion(id: string) {
    const grounds = get().grounds;
    grounds.byId[id].version++;

    set({ grounds });
  },
  seed: "1337",
  maxHeight: 64
}));
