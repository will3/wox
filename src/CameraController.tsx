import { Vector3, Euler } from "three";
import { useFrame } from "react-three-fiber";
import React, { useEffect, useState } from "react";
import Camera from "./Camera";
import keycode from "keycode";
import { lerpEulers } from "./math";

export interface CameraControllerProps {
  target: Vector3;
}

export default (props: CameraControllerProps) => {
  const { target } = props;

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
  };

  useFrame(() => {
    setRotation(lerpEulers(rotation, targetRotation, 0.5));
  });

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  const distance = 400;
  const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");
  const [rotation, setRotation] = useState(initialRotation);
  const [targetRotation, setTargetRotation] = useState(initialRotation);

  return <Camera {...{ target, distance, rotation }} />;
};
