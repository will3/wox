import { useCallback, useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import { Euler, Vector3 } from "three";
import { lerpEulers } from "../../../utils/math";
import { useCameraStore } from "../store";

export function CameraController() {
  const { camera } = useThree();

  const target = useCameraStore((camera) => camera.target);
  const distance = useCameraStore((camera) => camera.distance);
  const targetRotation = useCameraStore((camera) => camera.targetRotation);
  const rotation = useRef(targetRotation);

  const updateCamera = useCallback(() => {
    const rotationValue = new Euler(...rotation.current);
    const targetValue = new Vector3(...target);
    const position = new Vector3(0, 0, 1)
      .applyEuler(rotationValue)
      .multiplyScalar(distance)
      .add(targetValue);
    camera.position.copy(position);
    camera.rotation.copy(rotationValue);
    camera.lookAt(targetValue);
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
}