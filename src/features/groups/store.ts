import { GroundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import { Group } from "./Group";
import { GroupCalculator } from "./GroupCalculator";

interface GroupData {
    origin: Vector3;
    groups: Group[];
}

export class GroupStore {
    private map = new Map<string, GroupData>();
    groundStore: GroundStore;

    constructor(groundStore: GroundStore) {
        makeAutoObservable(this);
        this.groundStore = groundStore;
    }

    calcGroups(origin: Vector3) {
        const chunk = this.groundStore.chunks.getChunk(origin.toArray() as [number, number, number]);
        if (chunk == null) {
            return;
        }
        const calculator = new GroupCalculator(chunk);
        const key = origin.toArray().join(",");
        let data = this.map.get(key);
        if (data == null) {
            data = {
                origin,
                groups: []
            };
            this.map.set(key, data);
        }
        data.groups = calculator.calcGroups();
    }
}
