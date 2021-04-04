import { useChunks } from "features/chunks/hooks/useChunks";
import { useEffect } from "react";
import { useWaterStore } from "StoreProvider";
import { Vector3 } from "three";

export interface WaterChunkProps {
  origin: Vector3;
  version: number;
}

export function WaterChunk({ origin, version }: WaterChunkProps) {
  const chunks = useChunks();
  const waterStore = useWaterStore();

  useEffect(() => {
    if (version === 0) {
      return;
    }
    waterStore.generateWater(chunks, origin);

    console.log(`Generate water ${origin.toArray().join(",")}`);
  }, [version]);
  return null;
}
