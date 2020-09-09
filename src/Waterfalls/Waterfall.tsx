import { WaterfallData } from "./WaterfallData";
import { useEffect } from "react";
import { useStore } from "../stores/store";
import Layers from "../Layers";
import { Vector3, Color } from "three";
import ChunksData from "../Chunks/ChunksData";
import { WaterfallPoint } from "./traceWaterfall";

export interface WaterfallProps {
  data: WaterfallData;
}

export function Waterfall({ data }: WaterfallProps) {
  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const waterColor = useStore((state) => state.waterColor);

  useEffect(() => {
    applyWaterfall(data.points, groundChunks, waterColor);
  }, []);

  return null;
}

const applyWaterfall = (
  points: WaterfallPoint[],
  groundChunks: ChunksData,
  waterColor: Color
) => {
  for (let pointer of points) {
    const coord = pointer.coord;
    const v = groundChunks.get(coord.x, coord.y, coord.z)!;
    if (v < 0) {
      groundChunks.set(coord.x, coord.y, coord.z, 1);
    }

    groundChunks.setColor(
      coord.x,
      coord.y,
      coord.z,
      waterColor.toArray() as [number, number, number]
    );
  }
};
