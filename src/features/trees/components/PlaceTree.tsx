import { useMouseDown } from "features/input/hooks/useMouseDown";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useInputStore, useTreeStore } from "StoreProvider";
import { Vector3 } from "three";

export const PlaceTree = observer(() => {
    const treeStore = useTreeStore();
    const inputStore = useInputStore();

    useMouseDown(0, useCallback(() => {
        if (inputStore.hover == null) {
            return;
        }
        const coord = inputStore.hover.coord;
        const { voxelNormal } = inputStore.hover.voxel;
        const size = 1 + Math.pow(Math.random(), 1.5) * 0.5;
        treeStore.addTree({
            key: coord.join(","),
            normal: new Vector3().fromArray(voxelNormal),
            size,
            position: new Vector3().fromArray(coord)
        })
    }, []));

    return null;
});