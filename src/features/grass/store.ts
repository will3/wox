import ChunkData from "features/chunks/ChunkData";
import { GroundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";
import { Color, Vector3 } from "three";

export class GrassStore {
    groundStore: GroundStore;
    grassColor = new Color(0.08, 0.1, 0.065);
    sandColor = new Color(0.117, 0.129, 0.099);

    constructor(groundStore: GroundStore) {
        makeAutoObservable(this);
        this.groundStore = groundStore;
    }

    generateGrass(chunk: ChunkData) {
        const waterLevel = this.groundStore.waterLevel;
        const meshData = chunk.meshData!;
        const voxels = meshData.voxels;

        let count = 0;
        const startTime = Date.now();

        for (const voxel of voxels) {
            const [i, j, k] = voxel.coord;
            const absY = chunk.origin[1] + j;

            if (absY === waterLevel) {
                chunk.setColor(i, j, k, this.sandColor);
                continue;
            }

            if (absY < waterLevel) {
                continue;
            }

            const normal = voxel.voxelNormal;

            const dot = new Vector3(0, -1, 0).dot(new Vector3().fromArray(normal));

            if (dot > 0.75) {
                chunk.setColor(i, j, k, this.grassColor);
                count++;
            }
        }

        console.log(`Generated grass ${count} voxels, elapsed ${Date.now() - startTime}ms`)
    }
}