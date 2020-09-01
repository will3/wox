import { WaterfallData } from "./WaterfallData";
import { useEffect } from "react";
import { useStore } from "../store";
import Layers from "../Layers";
import { Vector3, Color } from "three";
import ChunksData from "../Chunks/ChunksData";
import generateWaterfall, { WaterfallPoint } from "./generateWaterfall";

export interface WaterfallProps {
  data: WaterfallData;
}

export function Waterfall({ data }: WaterfallProps) {
  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const waterColor = useStore((state) => state.waterColor);

  useEffect(() => {
    const results = generateWaterfall(data.position, groundChunks);
    applyWaterfall(results, groundChunks, waterColor);
  }, []);

  return null;
}

const applyWaterfall = (
  results: WaterfallPoint[],
  groundChunks: ChunksData,
  waterColor: Color
) => {
  for (let pointer of results) {
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
