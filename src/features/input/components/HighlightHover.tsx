import { useEffect } from "react";
import { useThree } from "react-three-fiber";
import { Color, Vector3, Quaternion } from "three";
import React from "react";
import Layers from "../../chunks/Layers";
import raycast from "../../../utils/raycast";
import { observer } from "mobx-react-lite";
import { useChunksStore, useInputStore } from "StoreProvider";

export const HighlightHover = observer(() => {
  const inputStore = useInputStore();
  const chunksStore = useChunksStore();

  const mouse = inputStore.mouse;
  const { camera, scene } = useThree();
  const hover = inputStore.hover;

  useEffect(() => {
    const result = raycast(mouse, camera, scene, chunksStore.chunksList, [Layers.ground]);
    if (result != null) {
      inputStore.setHover(result);
    }
  }, [mouse]);

  if (hover == null) {
    return null;
  }

  const coordCenter = new Vector3()
    .fromArray(hover.coord)
    .add(new Vector3(0.5, 0.5, 0.5));
  const normalVector = new Vector3().fromArray(hover.face.normal);

  const position = coordCenter
    .clone()
    .add(normalVector.clone().multiplyScalar(0.5 + 0.01));

  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 0, 1),
    normalVector
  );

  return (
    <mesh position={position} quaternion={quaternion}>
      <planeGeometry args={[1, 1]} attach="geometry"></planeGeometry>
      <meshBasicMaterial color={new Color(1.0, 0.0, 1.0)} attach="material" />
    </mesh>
  );
});
