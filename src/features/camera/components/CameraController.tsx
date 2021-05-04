import { useKeyUp } from "features/input/hooks/useKeyUp";
import { Key } from "features/input/keymap";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import { useCameraStore } from "StoreProvider";
import { lerpEulers } from "../../../utils/math";

export const CameraController = observer(() => {
  const { camera } = useThree();

  const cameraStore = useCameraStore();

  const targetRotation = cameraStore.targetRotation;
  const distance = cameraStore.distance;
  const zoomRate = cameraStore.zoomRate;

  const updateCamera = useCallback(() => {
    camera.position.copy(cameraStore.position);
    camera.lookAt(cameraStore.target);
  }, [cameraStore.position, cameraStore.target]);

  useEffect(() => {
    updateCamera();
  }, [updateCamera]);

  const animate = useCallback(() => {
    const nextRotation = lerpEulers(cameraStore.rotation, cameraStore.targetRotation, 0.5);
    cameraStore.setRotation(nextRotation);
    ref.current = requestAnimationFrame(animate);
    updateCamera();
  }, [cameraStore.targetRotation]);

  const ref = useRef<number>();

  useEffect(() => {
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current != null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [animate]);

  useKeyUp(Key.Left, useCallback(() => {
    const next = targetRotation.clone();
    next.y -= Math.PI / 2;
    cameraStore.setTargetRotation(next);
  }, [targetRotation]));

  useKeyUp(Key.Right, useCallback(() => {
    const next = targetRotation.clone();
    next.y += Math.PI / 2;
    cameraStore.setTargetRotation(next);
  }, [targetRotation]))

  useKeyUp(Key.ZoomIn, useCallback(() => {
    cameraStore.setDistance(distance / zoomRate);
  }, [distance, zoomRate]));

  useKeyUp(Key.ZoomOut, useCallback(() => {
    cameraStore.setDistance(distance * zoomRate);
  }, [distance, zoomRate]));

  return null;
});
