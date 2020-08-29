import React, { useRef, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import { useCameraStore } from "./stores/cameraStore";
import { Vector3 } from "three";
import Planet from "./Planet/Planet";

export default () => {
  const size = [5, 3, 3] as [number, number, number];
  const chunkSize = 32;

  const setTarget = useCameraStore((state) => state.setTarget);

  useEffect(() => {
    const target = new Vector3(
      (size[0] * chunkSize) / 2,
      chunkSize / 2,
      (size[2] * chunkSize) / 2
    );
    setTarget(target);
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
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
