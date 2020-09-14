import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import { Vector3, VSMShadowMap } from "three";
import Ground from "./Ground/Ground";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import Light from "./Light";
import HighlightHover from "./HighlightHover";
import { chunkSize } from "./constants";
import PlaceObject from "./Brushes/PlaceObject";
import ChunksData from "./Chunks/ChunksData";
import { VoxelInfo } from "./Chunks/VoxelInfo";
import Layers from "./Layers";
import placeRock from "./Brushes/placeRock";
import placeTree from "./Brushes/placeTree";
import Structure from "./Structure";
import Grids from "./Grid/Grids";
import HighlightGrid from "./HighlightGrid";
import PlaceStructure from "./PlaceStructure";
import Structures from "./Structures";
import Mesher from "./Chunks/Mesher";
import Waterfalls from "./Waterfalls/Waterfalls";
import Trees from "./Trees/Trees";
import Water from "./Water/Water";
import { useGroundStore } from "./stores/ground";

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
