import { useEffect } from "react";
import keycode from "keycode";
import { useInputStore } from "./stores/input";
import { Vector2 } from "three";
import { useCameraStore } from "./features/camera/store";

export default () => {
  const zoomRate = 1.1;

  const targetRotation = useCameraStore((state) => state.targetRotation);
  const distance = useCameraStore((state) => state.distance);
  const setMouse = useInputStore((state) => state.setMouse);
  const setTargetRotation = useCameraStore((state) => state.setTargetRotation);
  const setDistance = useCameraStore((state) => state.setDistance);

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (key === "q") {
      const next = targetRotation;
      next[1] -= Math.PI / 2;
      setTargetRotation(next);
    } else if (key === "e") {
      const next = targetRotation;
      next[1] += Math.PI / 2;
      setTargetRotation(next);
    }

    if (key === "=") {
      setDistance(distance / zoomRate);
    } else if (key === "-") {
      setDistance(distance * zoomRate);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMouse(new Vector2(x, y));
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return null;
};
