import React, { useRef } from "react";
import { Canvas } from "react-three-fiber";
import { Vector3, Euler } from "three";
import Planet from "./Planet/Planet";

export default () => {
  const size = [5, 3, 3] as [number, number, number];
  const chunkSize = 32;
  const target = new Vector3(
    (size[0] * chunkSize) / 2,
    0,
    (size[2] * chunkSize) / 2
  );
  const distance = 400;
  const rotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");

  return (
    <Canvas
      camera={calcCamera(target, rotation, distance)}
      onCreated={(props) => {
        props.gl.setClearColor(0x37D5F7);
      }}
    >
      <ambientLight color={0x999999} />
      <directionalLight position={[8, 3, 2]} intensity={0.6} />
      <Planet size={size} />
    </Canvas>
  );
};

const calcCamera = (target: Vector3, rotation: Euler, distance: number) => {
  return {
    fov: 30,
    position: new Vector3(0, 0, 1)
      .applyEuler(rotation)
      .multiplyScalar(distance)
      .add(target),
    rotation,
  };
};
