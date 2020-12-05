import React from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./features/input/components/UserInput";
import CameraController from "./features/camera/components/CameraController";
import { Stats } from "drei";
import { VSMShadowMap } from "three";
import Ground from "./features/ground/components/Ground/Ground";
import { AlwaysLongShadows } from "./features/light/components/AlwaysLongShadows";
import Light from "./features/light/components/Light";
import Grids from "features/grid/components/Grids";
import Structures from "./features/structures/components/Structures";
import Mesher from "./features/chunks/Mesher";
import Waterfalls from "./features/waterfalls/components/Waterfalls";
import Trees from "./features/trees/components/Trees";
import Water from "./features/water/components/Water";
import { useGroundStore } from "./features/ground/store";

import "./app.css";

export default () => {
  const size = useGroundStore((state) => state.size);

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
        <Light />
        <CameraController />
        <Ground size={size} seed={1337} />
        <Grids />
        <Structures />
        <Mesher />
        <Waterfalls />
        <Trees />
        <Water />
        <UserInput />
      </Canvas>
      <Stats />
    </>
  );
};
