import { Vector3 } from "three";
import ChunkData from "features/chunks/ChunkData";
import { Group } from "./Group";

export class GroupCalculator {
    chunk: ChunkData;
    constructor(chunk: ChunkData) {
        this.chunk = chunk;
    }

    calcGroups() {
        const map = this.createMap();
        const visited = new Set<string>();

        const groups: Group[] = [];
        while (map.size > 0) {
            const coord = this.getFirstCoord(map);
            const group = this.getGroup(coord, visited, map);
            groups.push(group);
        }

        return groups;
    }

    getGroup(coord: Vector3, visited: Set<string>, map: Map<string, Vector3>) {
        const leads: Vector3[] = [coord];
        map.delete(this.getKey(coord));
        const coords: Vector3[] = [];
        let grounded = false;

        while (leads.length > 0) {
            const lead = leads.pop();
            if (lead == null) {
                break;
            }
            coords.push(lead);
            if (lead.y === 0) {
                grounded = true;
            }
            const neighbours = this.getNeighbours(lead);
            for (const neighbour of neighbours) {
                const key = this.getKey(neighbour);
                if (visited.has(key)) {
                    continue;
                }
                visited.add(key);
                const v = this.chunk.get(neighbour.x, neighbour.y, neighbour.z);
                if (v != null && v > 0) {
                    leads.push(neighbour);
                    map.delete(key);
                }
            }
        }

        const group = new Group(coords);
        group.grounded = grounded;
        return group;
    }

    *getNeighbours(coord: Vector3) {
        yield new Vector3(coord.x - 1, coord.y, coord.z);
        yield new Vector3(coord.x + 1, coord.y, coord.z);
        yield new Vector3(coord.x, coord.y - 1, coord.z);
        yield new Vector3(coord.x, coord.y + 1, coord.z);
        yield new Vector3(coord.x, coord.y, coord.z - 1);
        yield new Vector3(coord.x, coord.y, coord.z + 1);
    }

    createMap() {
        const map = new Map<string, Vector3>();

        const chunk = this.chunk;

        const origin = chunk.origin;
        for (let i = 0; i < chunk.size; i++) {
            for (let j = 0; j < chunk.size; j++) {
                for (let k = 0; k < chunk.size; k++) {
                    const v = chunk.get(i, j, k);
                    if (v != null && v > 0) {
                        const coord = new Vector3(i, j, k);
                        const key = this.getKey(coord);
                        map.set(key, coord);
                    }
                }
            }
        }

        return map;
    }

    getFirstCoord(map: Map<string, Vector3>) {
        return map.size === 0 ? null : map.entries().next().value[1];
    }

    getKey(coord: Vector3) {
        return coord.toArray().join(",");
    }
}
