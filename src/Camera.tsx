import React from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3, Euler } from "three";

export interface CameraProps {
  target: Vector3;
  rotation: Euler;
  distance: number;
}

export default (props: CameraProps) => {
  const { camera } = useThree();
  const { target, rotation, distance } = props;

  useFrame(() => {
    const position = new Vector3(0, 0, 1)
      .applyEuler(rotation)
      .multiplyScalar(distance)
      .add(target);
    camera.position.copy(position);
    camera.rotation.copy(rotation);
  });

  return <></>;
};
