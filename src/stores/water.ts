import { Color } from "three";
import create from "zustand";

export interface WaterState {
  waterLevel: number;
  waterColor: Color;
  waterAlpha: number;
}

export const useWaterStore = create((set) => ({
  waterColor: new Color(0.08, 0.12, 0.2),
  waterAlpha: 0.4,
  waterLevel: 12,
}));
