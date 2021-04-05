import { createContext, ReactNode, useRef } from "react";
import React from "react";
import { Mesher } from "./Mesher";
import { ShaderMaterial } from "three";

export interface ChunksProviderProps {
  children: ReactNode;
}

export const ChunksContext = createContext({
  materials: new Map<string, ShaderMaterial>(),
});

export function ChunksProvider({ children }: ChunksProviderProps) {
  const materialsRef = useRef(new Map<string, ShaderMaterial>());
  const materials = materialsRef.current;

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
