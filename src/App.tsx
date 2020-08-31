import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import {
  Vector3,
  VSMShadowMap,
} from "three";
import Planet from "./Planet/Planet";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import { useStore } from "./store";
import Light from "./Light";
import HighlightHover from "./HighlightHover";

export default () => {
  const size = [3, 2, 3] as [number, number, number];
  const chunkSize = 32;

  const setCamera = useStore((state) => state.setCamera);

  useEffect(() => {
    const target = new Vector3(
      (size[0] * chunkSize) / 2,
      chunkSize / 2,
      (size[2] * chunkSize) / 2
    );
    setCamera({ target });
  }, []);

  return (
    <>
      <Canvas
        camera={{ fov: 30 }}
        shadowMap={{
          enabled: true,
          type: VSMShadowMap,
        }}
        onCreated={(props) => {
          props.gl.setClearColor(0x333333);
        }}
      >
        <Light />
        <CameraController />
        <Planet size={size} seed={1237} />
        <AlwaysLongShadaws />
        <HighlightHover />
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
