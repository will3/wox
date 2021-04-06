import { chunkSize } from "./constants";
import { CameraStore } from "features/camera/store";
import ChunksData from "features/chunks/ChunksData";
import Layers from "features/chunks/Layers";
import { ChunksStore } from "features/chunks/store";
import { GridStore } from "features/grid/store";
import { GroundStore } from "features/ground/store";
import { InputStore } from "features/input/store";
import { LightStore } from "features/light/store";
import { StructureStore } from "features/structures/store";
import { TreeStore } from "features/trees/store";
import { WaterStore } from "features/water/store";
import { WaterfallStore } from "features/waterfalls/store";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import seedrandom from "seedrandom";

interface StoreContextValue {
    groundStore?: GroundStore;
    chunksStore?: ChunksStore;
    cameraStore?: CameraStore;
    waterfallStore?: WaterfallStore;
    treeStore?: TreeStore;
    gridStore?: GridStore;
    structureStore?: StructureStore;
    lightStore?: LightStore;
    inputStore?: InputStore;
    waterStore?: WaterStore;
}

const StoreContext = createContext<StoreContextValue>({});

export interface StoreProviderProps {
    children: ReactNode;
}

function nextSeed(seed: string) {
    const rng = seedrandom(seed)
    return rng().toString();
}

export function StoreProvider({ children }: StoreProviderProps) {
    const store = useMemo<StoreContextValue>(() => {
        let seed = Math.random().toString();
        console.log(`Seed ${seed}`);
        const waterLevel = 3;

        const chunksStore = new ChunksStore();
        chunksStore.waterLevel = waterLevel;

        const groundChunks = new ChunksData(chunkSize, Layers.ground);
        const groundStore = new GroundStore(seed, chunksStore, groundChunks);
        groundStore.waterLevel = waterLevel;
        chunksStore.addChunks(groundChunks);

        const treeChunks = new ChunksData(chunkSize, Layers.trees);
        treeChunks.normalBias = 0.8;
        const treeStore = new TreeStore(seed = nextSeed(seed), treeChunks, groundStore);
        chunksStore.addChunks(treeChunks);

        const cameraStore = new CameraStore(groundStore);
        const waterfallStore = new WaterfallStore(seed = nextSeed(seed), groundStore);
        const gridStore = new GridStore();

        const structureChunks = new ChunksData(chunkSize, Layers.structures);
        structureChunks.renderAllSurfaces = true;
        const structureStore = new StructureStore(structureChunks);
        chunksStore.addChunks(structureChunks);

        const lightStore = new LightStore();
        const inputStore = new InputStore();

        const waterChunks = new ChunksData(chunkSize, Layers.water);
        waterChunks.isWater = true;
        waterChunks.normalBias = 1.0;
        waterChunks.skyBias = 1.0;
        waterChunks.offset = [0, -0.5, 0];
        const waterStore = new WaterStore(waterChunks);
        waterStore.waterLevel = waterLevel;
        chunksStore.addChunks(waterChunks);

        return {
            chunksStore,
            groundStore,
            treeStore,
            cameraStore,
            waterfallStore,
            gridStore,
            structureStore,
            lightStore,
            inputStore,
            waterStore,
        }
    }, []);

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}

export const useChunksStore = createStoreHook("chunks", (store => store.chunksStore));
export const useGroundStore = createStoreHook("ground", (store => store.groundStore));
export const useCameraStore = createStoreHook("camera", (store => store.cameraStore));
export const useWaterfallStore = createStoreHook("waterfall", (store => store.waterfallStore));
export const useTreeStore = createStoreHook("tree", (store => store.treeStore));
export const useGridStore = createStoreHook("grid", (store => store.gridStore));
export const useStructureStore = createStoreHook("structure", (store => store.structureStore));
export const useInputStore = createStoreHook("input", (store => store.inputStore));
export const useLightStore = createStoreHook("light", (store => store.lightStore));
export const useWaterStore = createStoreHook("water", (store => store.waterStore));

export function createStoreHook<T>(name: string, callback: (store: StoreContextValue) => T) {
    function hook() {
        const value = useContext(StoreContext);
        const store = callback(value);
        if (store == null) {
            throw new Error(`${name} store is empty!`);
        }
        return store!;
    }

    return hook;
}