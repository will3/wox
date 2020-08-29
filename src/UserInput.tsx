import { useEffect } from "react";
import keycode from "keycode";
import { useCameraStore } from "./stores/cameraStore";

export default () => {
  const zoomRate = 1.1;

  const targetRotation = useCameraStore((state) => state.targetRotation);
  const setTargetRotation = useCameraStore((state) => state.setTargetRotation);
  const setDistance = useCameraStore((state) => state.setDistance);
  const distance = useCameraStore((state) => state.distance);

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (key === "q") {
      const next = targetRotation.clone();
      next.y -= Math.PI / 2;
      setTargetRotation(next);
    } else if (key === "e") {
      const next = targetRotation.clone();
      next.y += Math.PI / 2;
      setTargetRotation(next);
    }

    if (key === "=") {
      setDistance(distance / zoomRate);
    } else if (key === "-") {
      setDistance(distance * zoomRate);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return null;
};
