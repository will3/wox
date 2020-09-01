import { Vector3 } from "three";
import { WaterfallPoint } from "./traceWaterfall";

export interface WaterfallData {
  key: string;
  position: Vector3;
  points: WaterfallPoint[];
}
