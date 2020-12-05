import { Vector2, Vector3 } from "three";
import { QuadChunk } from "./QuadChunk";

const intersectRectangle = (point: Vector2, min: Vector2, max: Vector2) => {
  return (
    point.x >= min.x && point.x <= max.x && point.y >= min.y && point.y <= max.y
  );
};

export default class QuadMap<T> {
  columns: { [id: string]: QuadChunk<T> } = {};
  size = 32;
  version = 0;

  set(position: Vector3, value: T): void {
    const origin = this.getOrigin(position);
    const chunk = this.getOrCreateChunk(origin);
    chunk.set(position, value);
    this.version++;
  }

  get(position: Vector3): T | undefined {
    const origin = this.getOrigin(position);
    const chunk = this.getChunk(origin);
    return chunk.get(position);
  }

  find(position: Vector3, distance: number): T[] {
    const origins = this.getOriginsToSearch(position, distance);
    const results: T[] = [];

    for (const origin of origins) {
      const chunk = this.getChunk(origin);
      if (chunk == null) {
        continue;
      }
      for (const id in chunk.items) {
        const entry = chunk.items[id];
        const dis = entry.position.distanceTo(position);
        if (dis < distance) {
          results.push(entry.value);
        }
      }
    }

    return results;
  }

  getOriginsToSearch(position: Vector3, distance: number): Vector2[] {
    const origin = this.getOrigin(position);

    const origins = [origin];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const chunk = origin
          .clone()
          .add(new Vector2(i, j).multiplyScalar(this.size));

        if (i === 0 && j === 0) {
          continue;
        }

        const min = chunk.clone().add(new Vector2(-distance, -distance));
        const rect = {
          min,
          max: min
            .clone()
            .add(new Vector2(this.size, this.size))
            .add(new Vector2(distance, distance)),
        };
        const result = intersectRectangle(
          new Vector2(position.x, position.z),
          rect.min,
          rect.max
        );
        if (result) {
          origins.push(chunk);
        }
      }
    }

    return origins;
  }

  private getOrigin(position: Vector3): Vector2 {
    return new Vector2(
      Math.floor(position.x / this.size) * this.size,
      Math.floor(position.z / this.size) * this.size
    );
  }

  private getOrCreateChunk(origin: Vector2): QuadChunk<T> {
    const key = `${origin.x},${origin.y}`;
    let chunk = this.columns[key];
    if (chunk != null) {
      return chunk;
    }

    chunk = new QuadChunk(origin);
    this.columns[key] = chunk;

    return chunk;
  }

  private getChunk(origin: Vector2) {
    const key = `${origin.x},${origin.y}`;
    return this.columns[key];
  }

  visit(callback: (entry: T) => void): void {
    for (const key in this.columns) {
      this.columns[key].visit(callback);
    }
  }
}

export interface Entry<T> {
  position: Vector3;
  value: T;
}
