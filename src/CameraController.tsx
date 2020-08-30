import { useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import { lerpEulers } from "./math";
import { useStore } from "./store";

export default () => {
  const { camera } = useThree();

  const cameraState = useStore((state) => state.camera);
  const { target, distance, rotation, targetRotation } = cameraState;
  const setCamera = useStore((state) => state.setCamera);

  useEffect(() => {
    const position = new Vector3(0, 0, 1)
      .applyEuler(rotation)
      .multiplyScalar(distance)
      .add(target);
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    camera.lookAt(target);
  }, [target, rotation, distance]);

  useFrame(() => {
    const nextRotation = lerpEulers(rotation, targetRotation, 0.5);
    setCamera({ rotation: nextRotation });
  });

  return null;
};
