import { GroundData } from "features/ground/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useChunksStore, useGrassStore, useGroundStore } from "StoreProvider";

export interface GrassChunkProps {
    ground: GroundData;
}

export const GrassChunk = observer(({ ground }: GrassChunkProps) => {
    const grassStore = useGrassStore();
    const chunksStore = useChunksStore();
    const chunkVersion = chunksStore.getChunkVersion(ground.chunkId);
    const groundStore = useGroundStore();

    useEffect(() => {
        if (chunkVersion === 1) {
            const chunk = groundStore.chunks.getChunk(ground.origin.toArray() as [number, number, number]);
            grassStore.generateGrass(chunk!);
        }
    }, [chunkVersion]);

    return null;
});