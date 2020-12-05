import { Vector2, Vector3 } from "three";
import { Entry } from "./QuadMap";

export class QuadChunk<T> {
  origin: Vector2;
  key: string;

  constructor(origin: Vector2) {
    this.origin = origin;
    this.key = this.origin.toArray().join(",");
  }

  items: { [key: string]: Entry<T> } = {};
  set(position: Vector3, value: T): void {
    const key = this.getKey(position);
    this.items[key] = {
      position,
      value,
    };
  }
  get(position: Vector3): T | undefined {
    const key = this.getKey(position);
    return this.items[key].value;
  }
  private getKey(position: Vector3) {
    return `${position.x},${position.y},${position.z}`;
  }
  visit(callback: (entry: T) => void): void {
    for (const key in this.items) {
      callback(this.items[key].value);
    }
  }
}
