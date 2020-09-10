import { useEffect, useRef } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3, Euler } from "three";
import { lerpEulers } from "./utils/math";
import { useCameraStore } from "./stores/camera";

export default () => {
  const { camera } = useThree();

  const rotateToTarget = useCameraStore((state) => state.rotateToTarget);

  let target = useCameraStore.getState().target;
  let distance = useCameraStore.getState().distance;
  let rotation = useCameraStore.getState().rotation;

  useCameraStore.subscribe(
    (v: Vector3 | null) => {
      if (v != null) target = v;
      updateCamera();
    },
    (state) => state.target
  );

  useCameraStore.subscribe(
    (v: number | null) => {
      if (v != null) distance = v;
      updateCamera();
    },
    (state) => state.distance
  );

  useCameraStore.subscribe(
    (v: Euler | null) => {
      if (v != null) rotation = v;
      updateCamera();
    },
    (state) => state.rotation
  );

  const updateCamera = () => {
    const position = new Vector3(0, 0, 1)
      .applyEuler(rotation)
      .multiplyScalar(distance)
      .add(target);
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    camera.lookAt(target);
  };

  const animate = () => {
    handleFrame();
    ref.current = requestAnimationFrame(animate);
  };

  const handleFrame = () => {
    rotateToTarget();
  };

  const ref = useRef<number>();

  useEffect(() => {
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current != null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, []);

  return null;
};
