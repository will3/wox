import React from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./features/camera/components/CameraController";
import { Stats } from "drei";
import { VSMShadowMap } from "three";
import Ground from "./features/ground/components/Ground/Ground";
import { AlwaysLongShadows } from "./AlwaysLongShadows";
import Light from "./Light";
import Grids from "features/grid/Grids";
import HighlightGrid from "./HighlightGrid";
import PlaceStructure from "./PlaceStructure";
import Structures from "./Structures";
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
        <AlwaysLongShadows />
        {/* <HighlightHover /> */}
        <HighlightGrid />
        <PlaceStructure />
        {/* <Brush /> */}
        {/* <PlaceWaterfall /> */}
        <Grids />
        <Structures />
        <Mesher />
        <Waterfalls />
        <Trees />
        <Water />
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
