import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import UserInput from "./UserInput";
import CameraController from "./CameraController";
import { Stats } from "drei";
import { Vector3, VSMShadowMap } from "three";
import Planet from "./Planet/Planet";
import AlwaysLongShadaws from "./AlwaysLongShadaws";
import { useStore } from "./store";
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
import GridLayer from "./Grid/GridLayer";
import HighlightGrid from "./HighlightGrid";
import PlaceStructure from "./PlaceStructure";
import Structures from "./Structures";
import Mesher from "./Chunks/Mesher";

export default () => {
  const size = useStore((state) => state.size);
  const setCamera = useStore((state) => state.setCamera);
  const addStructure = useStore((state) => state.addStructure);

  useEffect(() => {
    const target = new Vector3(
      (size.x * chunkSize) / 2,
      ((size.y - 1) * chunkSize) / 2,
      (size.z * chunkSize) / 2
    );
    setCamera({ target });
  }, []);

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
        <Planet size={size} seed={1337} />
        <AlwaysLongShadaws />
        {/* <HighlightHover /> */}
        <HighlightGrid />
        <PlaceStructure />
        {/* <Brush /> */}
        {/* <PlaceWaterfall /> */}
        <GridLayer />
        <Structures />
        <Mesher />
      </Canvas>
      <UserInput />
      <Stats />
    </>
  );
};
