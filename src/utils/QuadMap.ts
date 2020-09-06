import { Vector2, Vector3 } from "three";

const intersectRectangle = (point: Vector2, min: Vector2, max: Vector2) => {
  return (
    point.x >= min.x && point.x <= max.x && point.y >= min.y && point.y <= max.y
  );
};

export default class QuadMap<T> {
  map: { [id: string]: QuadChunk<T> } = {};
  size = 32;

  set(position: Vector3, value: T) {
    const origin = this.getOrigin(position);
    const chunk = this.getOrCreateChunk(origin);
    chunk.set(position, value);
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
      for (const id in chunk.map) {
        const entry = chunk.map[id];
        const dis = entry.position.distanceTo(position);
        if (dis < distance) {
          results.push(entry.value);
        }
      }
    }

    return results;
  }

  getOriginsToSearch(position: Vector3, distance: number) {
    const origin = this.getOrigin(position);

    const origins = [origin];

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
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

  private getOrigin(position: Vector3) {
    return new Vector2(
      Math.floor(position.x / this.size) * this.size,
      Math.floor(position.z / this.size) * this.size
    );
  }

  private getOrCreateChunk(origin: Vector2) {
    const key = `${origin.x},${origin.y}`;
    let chunk = this.map[key];
    if (chunk != null) {
      return chunk;
    }

    chunk = new QuadChunk();
    this.map[key] = chunk;

    return chunk;
  }

  private getChunk(origin: Vector2) {
    const key = `${origin.x},${origin.y}`;
    return this.map[key];
  }

  visit(callback: (entry: T) => void) {
    for (let key in this.map) {
      this.map[key].visit(callback);
    }
  }
}

class QuadChunk<T> {
  map: { [key: string]: Entry<T> } = {};
  set(position: Vector3, value: T) {
    const key = this.getKey(position);
    this.map[key] = {
      position,
      value,
    };
  }
  get(position: Vector3): T | undefined {
    const key = this.getKey(position);
    return this.map[key].value;
  }
  private getKey(position: Vector3) {
    return `${position.x},${position.y},${position.z}`;
  }
  visit(callback: (entry: T) => void) {
    for (let key in this.map) {
      callback(this.map[key].value);
    }
  }
}

interface Entry<T> {
  position: Vector3;
  value: T;
}
