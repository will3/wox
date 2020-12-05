import { Color, Vector3 } from "three";
import create from "zustand";
import Layers from "../Layers";
import { useChunkStore } from "../features/chunks/store";

export interface WaterState {
  waterLevel: number;
  waterColor: Color;
  waterAlpha: number;
  generateWater(origin: Vector3): void;
}

export const useWaterStore = create((set, get) => ({
  waterColor: new Color(0.08, 0.12, 0.2),
  waterAlpha: 0.4,
  waterLevel: 6,
  generateWater(origin: Vector3) {
    const { waterLevel, waterColor } = get();
    const chunksList = useChunkStore.getState().chunks;
    const groundChunks = chunksList[Layers.ground];
    const waterChunks = chunksList[Layers.water];

    if (origin.y > waterLevel) {
      return;
    }

    const groundChunk = groundChunks.getChunk(
      origin.toArray() as [number, number, number]
    );
    const chunk = waterChunks.getOrCreateChunk(
      origin.toArray() as [number, number, number]
    );

    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          const absY = j + origin.y;
          if (absY > waterLevel) {
            chunk.set(i, j, k, 0);
            continue;
          }
          const v = groundChunk.get(i, j, k) ?? 0;
          if (v > 0) {
            chunk.set(i, j, k, 0);
            continue;
          }
          chunk.set(i, j, k, 1);
          chunk.setColor(i, j, k, waterColor.toArray());
        }
      }
    }
  },
}));
