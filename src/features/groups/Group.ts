import { Vector3 } from "three";
import { nanoid } from "nanoid";

export class Group {
    id: string = nanoid();
    coords: Vector3[];
    private set: Set<string>;
    grounded = false;

    constructor(coords: Vector3[]) {
        this.coords = coords;
        this.set = new Set(coords.map(x => x.toArray().join(",")));
    }

    has(coord: Vector3) {
        return this.set.has(coord.toArray().join(","));
    }
}
