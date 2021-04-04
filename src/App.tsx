import React from "react";
import { Canvas } from "react-three-fiber";
import { UserInput } from "./features/input/components/UserInput";
import { CameraController } from "./features/camera/components/CameraController";
import { Stats } from "drei";
import { VSMShadowMap } from "three";
import { Light } from "./features/light/components/Light";

import "./app.css";
import { ChunksProvider } from "features/chunks/ChunksProvider";
import { Planet } from "features/planet/Planet";
import { StoreProvider } from "StoreProvider";

export function App() {
  return (
    <>
      <Canvas
        camera={{ fov: 30 }}
        shadowMap={{
          enabled: true,
          type: VSMShadowMap,
        }}
        onCreated={(props) => {
          props.gl.setClearColor(0x000000);
        }}
      >
        <StoreProvider>
          <ChunksProvider>
            <Light />
            <CameraController />
            <Planet />
            <UserInput />
          </ChunksProvider>
        </StoreProvider>
      </Canvas>
      <Stats />
    </>
  );
}
