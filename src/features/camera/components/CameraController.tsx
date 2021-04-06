import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import { useCameraStore } from "StoreProvider";
import { lerpEulers } from "../../../utils/math";

export const CameraController = observer(() => {
  const { camera } = useThree();

  const cameraStore = useCameraStore();

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

  return null;
});
