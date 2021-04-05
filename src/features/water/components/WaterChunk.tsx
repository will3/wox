import { useEffect } from "react";
import { useGroundStore, useWaterStore } from "StoreProvider";
import { Vector3 } from "three";

export interface WaterChunkProps {
  origin: Vector3;
  version: number;
}

export function WaterChunk({ origin, version }: WaterChunkProps) {
  const waterStore = useWaterStore();
  const groundStore = useGroundStore();

  const waterChunks = waterStore.chunks;
  const groundChunks = groundStore.chunks;

  useEffect(() => {
    if (version === 0) {
      return;
    }
    waterStore.generateWater(groundChunks, waterChunks, origin);

    console.log(`Generate water ${origin.toArray().join(",")}`);
  }, [version]);
  return null;
}
