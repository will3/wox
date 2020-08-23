import React from "react";
import Planet from "./Planet/Planet";
import { Vector3 } from "three";
import CameraController from "./CameraController";

export interface MainProps {
  size: [number, number, number];
}

export default (props: MainProps) => {
  const { size } = props;

  const chunkSize = 32;
  const target = new Vector3(
    (size[0] * chunkSize) / 2,
    chunkSize / 2,
    (size[2] * chunkSize) / 2
  );

  return (
    <>
      <CameraController target={target} />
      <ambientLight color={0x999999} />
      <directionalLight position={[8, 3, 2]} intensity={0.6} />
      <Planet size={size} seed={1337} />
    </>
  );
};
