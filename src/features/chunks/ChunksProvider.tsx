import { chunkSize } from "../../constants";
import { createContext, ReactNode, useLayoutEffect, useRef } from "react";
import ChunksData from "./ChunksData";
import Layers from "./Layers";
import React from "react";
import { Mesher } from "./Mesher";
import { useChunksStore } from "StoreProvider";
import { ShaderMaterial } from "three";

export interface ChunksProviderProps {
  children: ReactNode;
}

export const ChunksContext = createContext({
  materials: new Map<string, ShaderMaterial>(),
});

export function ChunksProvider({ children }: ChunksProviderProps) {
  const chunksStore = useChunksStore();
  const materialsRef = useRef(new Map<string, ShaderMaterial>());

  const materials = materialsRef.current;

  useLayoutEffect(() => {
    const trees = new ChunksData(chunkSize, Layers.trees);
    trees.normalBias = 0.8;

    const water = new ChunksData(chunkSize, Layers.water);
    water.isWater = true;
    water.normalBias = 1.0;
    water.skyBias = 1.0;
    water.offset = [0, -0.5, 0];

    const structures = new ChunksData(chunkSize, Layers.structures);
    structures.renderAllSurfaces = true;

    const ground = new ChunksData(chunkSize, Layers.ground);

    chunksStore.addLayers(ground, trees, water, structures);
  }, []);

  return (
    <>
      <Mesher />
      <ChunksContext.Provider value={{
        materials,
      }}>
        {children}
      </ChunksContext.Provider>
    </>
  );
}
