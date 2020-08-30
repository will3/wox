import React, { useRef, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import { Vector3 } from "three";
import Planet from "./Planet/Planet";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import { useStore } from "./store";

export default () => {
  const size = [5, 3, 3] as [number, number, number];
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
        onCreated={(props) => {
          props.gl.setClearColor(0x37d5f7);
        }}
      >
        <CameraController />
        <Planet size={size} seed={1337} />
        <AlwaysLongShadaws />
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
