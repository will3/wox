import { useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import { useCameraStore } from "./stores/cameraStore";
import { lerpEulers } from "./math";

export default () => {
  const { camera } = useThree();

  const target = useCameraStore(state => state.target);
  const rotation = useCameraStore(state => state.rotation);
  const distance = useCameraStore(state => state.distance);
  const targetRotation = useCameraStore(state => state.targetRotation);
  const setRotation = useCameraStore(state => state.setRotation);

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
    setRotation(lerpEulers(rotation, targetRotation, 0.5));
  });

  return null;
};
