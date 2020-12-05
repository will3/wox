import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./features/camera/components/CameraController";
import { Stats } from "drei";
import { Vector3, VSMShadowMap } from "three";
import Ground from "./features/ground/components/Ground/Ground";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import Light from "./Light";
import HighlightHover from "./HighlightHover";
import { chunkSize } from "./constants";
import PlaceObject from "./Brushes/PlaceObject";
import ChunksData from "./features/chunks/ChunksData";
import { VoxelInfo } from "./features/chunks/VoxelInfo";
import Layers from "./Layers";
import placeRock from "./Brushes/placeRock";
import placeTree from "./Brushes/placeTree";
import Structure from "./Structure";
import Grids from "./Grid/Grids";
import HighlightGrid from "./HighlightGrid";
import PlaceStructure from "./PlaceStructure";
import Structures from "./Structures";
import Mesher from "./features/chunks/Mesher";
import Waterfalls from "./Waterfalls/Waterfalls";
import Trees from "./Trees/Trees";
import Water from "./Water/Water";
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
        <AlwaysLongShadaws />
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
