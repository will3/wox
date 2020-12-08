import { chunkSize } from "../../constants";
import { createContext, ReactNode, useMemo } from "react";
import ChunksData from "./ChunksData";
import Layers from "./Layers";
import React from "react";
import Mesher from "./Mesher";

export interface ChunksContextValue {
  chunks: ChunksData[];
}

export const ChunksContext = createContext({ chunks: [] as ChunksData[] });

export interface ChunksProviderProps {
  children: ReactNode;
}

export function ChunksProvider({ children }: ChunksProviderProps) {
  const value = useMemo<ChunksContextValue>(() => {
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

    return {
      chunks: [ground, trees, water, structures],
    };
  }, []);

  return (
    <ChunksContext.Provider value={value}>
      <Mesher />
      {children}
    </ChunksContext.Provider>
  );
}
