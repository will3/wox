import { useEffect } from "react";
import Layers from "../../chunks/Layers";
import { Color } from "three";
import ChunksData from "features/chunks/ChunksData";
import { useChunkStore } from "features/chunks/store";
import { useWaterStore } from "features/water/water";
import { WaterfallData, WaterfallPoint } from "../store";
import { useChunks } from "features/chunks/hooks/useChunks";

export interface WaterfallProps {
  data: WaterfallData;
}

export function Waterfall({ data }: WaterfallProps) {
  const chunks = useChunks();
  const groundChunks = chunks[Layers.ground];
  const waterColor = useWaterStore((state) => state.waterColor);

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
  for (const pointer of points) {
    const coord = pointer.coord;
    const v = groundChunks.get(coord.x, coord.y, coord.z)!;
    if (v < 0) {
      groundChunks.set(coord.x, coord.y, coord.z, 1);
    }

    groundChunks.setColor(coord.x, coord.y, coord.z, waterColor.getHex());
  }
};
