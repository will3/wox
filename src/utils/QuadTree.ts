import { Vector2, Vector3 } from "three";

export default class QuadTree<T> {
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
}

class QuadChunk<T> {
  map: { [key: string]: T } = {};
  set(position: Vector3, value: T) {
    const key = this.getKey(position);
    this.map[key] = value;
  }
  get(position: Vector3): T | undefined {
    const key = this.getKey(position);
    return this.map[key];
  }
  private getKey(position: Vector3) {
    return `${position.x},${position.y},${position.z}`;
  }
}
