import ChunksData from "features/chunks/ChunksData";
import { makeAutoObservable } from "mobx";
import { Color, Vector3 } from "three";

export class WaterStore {
  waterColor = new Color(0.08, 0.12, 0.2);
  waterAlpha = 0.4;
  waterLevel = 6;
  chunks: ChunksData;

  constructor(chunks: ChunksData) {
    makeAutoObservable(this);
    this.chunks = chunks;
  }

  generateWater(groundChunks: ChunksData, waterChunks: ChunksData, origin: Vector3) {
    if (origin.y > this.waterLevel) {
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
          if (absY > this.waterLevel) {
            chunk.set(i, j, k, 0);
            continue;
          }
          const v = groundChunk.get(i, j, k) ?? 0;
          if (v > 0) {
            chunk.set(i, j, k, 0);
            continue;
          }
          chunk.set(i, j, k, 1);
          chunk.setColor(i, j, k, this.waterColor);
        }
      }
    }
  }
}
