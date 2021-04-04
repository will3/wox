import { useMemo } from "react";
import { Vector2 } from "three";
import { groundStore } from "../store";

export function useColumns() {
    const size = groundStore.size;
    const chunkSize = groundStore.chunkSize;

    return useMemo(() => {
        const columns: Vector2[] = [];
        for (let i = 0; i < size.x; i++) {
            for (let k = 0; k < size.z; k++) {
                columns.push(new Vector2(i, k).multiplyScalar(chunkSize));
            }
        }
        return columns;
    }, []);
}