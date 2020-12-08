import { useChunks } from "features/chunks/hooks/useChunks";
import { useEffect } from "react";
import { Vector3 } from "three";
import { useWaterStore } from "../water";

export interface WaterChunkProps {
  origin: Vector3;
  version: number;
}

export function WaterChunk({ origin, version }: WaterChunkProps) {
  const generateWater = useWaterStore((state) => state.generateWater);
  const chunks = useChunks();

  useEffect(() => {
    if (version === 0) {
      return;
    }
    generateWater(chunks, origin);

    console.log(`Generate water ${origin.toArray().join(",")}`);
  }, [version]);
  return null;
}
