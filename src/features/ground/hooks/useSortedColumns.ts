import { useMemo } from "react";
import { Vector2 } from "three";
import { useGroundStore } from "../store";
import { useColumns } from "./useColumns";

export function useSortedColumns() {
    const size = useGroundStore(state => state.size);
    const chunkSize = useGroundStore(state => state.chunkSize);
    const columns = useColumns();

    return useMemo(() => {
        const center = new Vector2(size.x - 1, size.z - 1)
            .multiplyScalar(0.5)
            .multiplyScalar(chunkSize);

        return columns.sort((a, b) => {
            const dis1 = center.clone().sub(a).length();
            const dis2 = center.clone().sub(b).length();
            const result = dis1 - dis2;
            return result;
        });
    }, [size, columns]);
}