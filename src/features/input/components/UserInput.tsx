import { useEffect } from "react";
import keycode from "keycode";
import { Vector2 } from "three";
import React from "react";
import { HighlightHover } from "./HighlightHover";
import { observer } from "mobx-react-lite";
import { useCameraStore, useInputStore } from "StoreProvider";

const keymap = {
  left: new Set(["a", "left"]),
  right: new Set(["d", "right"]),
};

export const UserInput = observer(() => {
  const zoomRate = 1.1;

  const cameraStore = useCameraStore();
  const targetRotation = cameraStore.targetRotation;
  const distance = cameraStore.distance;
  const inputStore = useInputStore();

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (keymap.left.has(key)) {
      const next = targetRotation.clone();
      next.y -= Math.PI / 2;
      cameraStore.setTargetRotation(next);
    } else if (keymap.right.has(key)) {
      const next = targetRotation.clone();
      next.y += Math.PI / 2;
      cameraStore.setTargetRotation(next);
    }

    if (key === "=") {
      cameraStore.setDistance(distance / zoomRate);
    } else if (key === "-") {
      cameraStore.setDistance(distance * zoomRate);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    inputStore.setMouse(new Vector2(x, y));
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

  return (
    <>
      <HighlightHover />
    </>
  );
});
