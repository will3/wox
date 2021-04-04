import { useEffect } from "react";
import keycode from "keycode";
import { Vector2 } from "three";
import React from "react";
import { HighlightHover } from "./HighlightHover";
import { cameraStore } from "features/camera/store";
import { observer } from "mobx-react-lite";
import { inputStore } from "../store";

export const UserInput = observer(() => {
  const zoomRate = 1.1;

  const targetRotation = cameraStore.targetRotation;
  const distance = cameraStore.distance;
  const setDistance = cameraStore.setDistance;

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (key === "q") {
      const next = targetRotation;
      next[1] -= Math.PI / 2;
      cameraStore.setTargetRotation(next);
    } else if (key === "e") {
      const next = targetRotation;
      next[1] += Math.PI / 2;
      cameraStore.setTargetRotation(next);
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
