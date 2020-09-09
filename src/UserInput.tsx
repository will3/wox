import { useEffect } from "react";
import keycode from "keycode";
import { useStore } from "./stores/store";
import { Vector2 } from "three";

export default () => {
  const zoomRate = 1.1;

  const targetRotation = useStore((state) => state.camera.targetRotation);
  const distance = useStore((state) => state.camera.distance);
  const setCamera = useStore((state) => state.setCamera);
  const setMouse = useStore((state) => state.setMouse);

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (key === "q") {
      const next = targetRotation.clone();
      next.y -= Math.PI / 2;
      setCamera({ targetRotation: next });
    } else if (key === "e") {
      const next = targetRotation.clone();
      next.y += Math.PI / 2;
      setCamera({ targetRotation: next });
    }

    if (key === "=") {
      setCamera({ distance: distance / zoomRate });
    } else if (key === "-") {
      setCamera({ distance: distance * zoomRate });
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
