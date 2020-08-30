import { useEffect } from "react";
import keycode from "keycode";
import { useStore } from "./store";

export default () => {
  const zoomRate = 1.1;

  const targetRotation = useStore((state) => state.camera.targetRotation);
  const distance = useStore((state) => state.camera.distance);
  const setCamera = useStore((state) => state.setCamera);

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
      setCamera({ distance: distance / zoomRate });
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
