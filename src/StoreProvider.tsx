import { CameraStore } from "features/camera/store";
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
        let seed = "1337";
        const chunksStore = new ChunksStore();
        const groundStore = new GroundStore(seed, chunksStore);
        const treeStore = new TreeStore(seed = nextSeed(seed));
        const cameraStore = new CameraStore(groundStore);
        const waterfallStore = new WaterfallStore(seed = nextSeed(seed), groundStore);
        const gridStore = new GridStore();
        const structureStore = new StructureStore();
        const lightStore = new LightStore();
        const inputStore = new InputStore();
        const waterStore = new WaterStore();

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

    console.log(store);

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