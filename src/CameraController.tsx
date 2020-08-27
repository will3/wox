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
  const [distance, setDistance] = useState(400);
  const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");
  const zoomRate = 1.1;
  const [rotation, setRotation] = useState(initialRotation);
  const [targetRotation, setTargetRotation] = useState(initialRotation);

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

    if (key === "=") {
      setDistance(distance / zoomRate);
    } else if (key === "-") {
      setDistance(distance * zoomRate);
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

  return <Camera {...{ target, distance, rotation }} />;
};
