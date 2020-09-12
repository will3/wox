import { Vector3 } from "three";
import create from "zustand";
import Curve from "../utils/Curve";
import { GroundData } from "./store";

export interface GroundState {
  size: Vector3;
  groundCurve: Curve;
  grounds: { [id: string]: GroundData };
  addGrounds(origins: Vector3[]): void;
  incrementGroundVersion(id: string): void;
  maxHeight: number;
}

export const useGroundStore = create<GroundState>((set, get) => ({
  size: new Vector3(5, 2, 5),
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
  maxHeight: 64,
}));
