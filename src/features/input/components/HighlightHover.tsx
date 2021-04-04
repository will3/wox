import { useEffect } from "react";
import { useInputStore } from "../store";
import { useThree } from "react-three-fiber";
import { Color, Vector3, Quaternion } from "three";
import React from "react";
import Layers from "../../chunks/Layers";
import raycast from "../../../utils/raycast";
import { useChunks } from "features/chunks/hooks/useChunks";

export default () => {
  const mouse = useInputStore((state) => state.mouse);
  const { camera, scene } = useThree();
  const chunks = useChunks();
  const setHover = useInputStore((state) => state.setHover);
  const hover = useInputStore((state) => state.hover);

  useEffect(() => {
    const result = raycast(mouse, camera, scene, chunks, [Layers.ground]);
    if (result != null) {
      setHover(result);
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
};
