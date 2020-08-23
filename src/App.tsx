import React, { useRef } from "react";
import { Canvas } from "react-three-fiber";
import Main from "./Main";

export default () => {
  const size = [5, 3, 3] as [number, number, number];

  return (
    <Canvas
      camera={{ fov: 30 }}
      onCreated={(props) => {
        props.gl.setClearColor(0x37d5f7);
      }}
    >
      <Main size={size}></Main>
    </Canvas>
  );
};
