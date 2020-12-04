import { useCallback, useEffect, useRef, useState } from "react";
import { useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { lerpEulers } from "./utils/math";
import { useCameraStore } from "./stores/camera";

export default () => {
  const { camera } = useThree();

  let target = useCameraStore((camera) => camera.target);
  let distance = useCameraStore((camera) => camera.distance);
  let targetRotation = useCameraStore((camera) => camera.targetRotation);
  const rotation = useRef(targetRotation);

  const updateCamera = useCallback(() => {
    const position = new Vector3(0, 0, 1)
      .applyEuler(rotation.current)
      .multiplyScalar(distance)
      .add(target);
    camera.position.copy(position);
    camera.rotation.copy(rotation.current);
    camera.lookAt(target);
  }, [target, distance]);

  useEffect(() => {
    updateCamera();
  }, [updateCamera]);

  const animate = useCallback(() => {
    const nextRotation = lerpEulers(rotation.current, targetRotation, 0.5);
    rotation.current = nextRotation;
    ref.current = requestAnimationFrame(animate);
    updateCamera();
  }, [targetRotation]);

  const ref = useRef<number>();

  useEffect(() => {
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current != null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [animate]);

  return null;
};
