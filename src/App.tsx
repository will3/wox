import React, { useEffect } from "react";
import { Canvas, useThree } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import {
  Vector3,
  PCFSoftShadowMap,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  SphereBufferGeometry,
} from "three";
import Planet from "./Planet/Planet";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import { useStore } from "./store";

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
          type: PCFSoftShadowMap,
        }}
        onCreated={(props) => {
          props.gl.setClearColor(0x333333);
        }}
      >
        <directionalLight
          position={new Vector3(1, 1, 1).multiplyScalar(100)}
          castShadow={true}
          shadowCameraTop={100}
          shadowCameraBottom={-100}
          shadowCameraLeft={-100}
          shadowCameraRight={100}
          shadowBias={-0.004}
        />
        <CameraController />
        <Planet size={size} seed={1237} />
        <AlwaysLongShadaws />
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
