import React, { useState, useEffect } from "react";
import Planet from "./Planet/Planet";
import { useFrame } from "react-three-fiber";
import { Euler, Vector3 } from "three";
import keycode from "keycode";
import Camera from "./Camera";

export interface MainProps {
  size: [number, number, number];
}

const lerp = (a: number, b: number, r: number) => {
  return a + (b - a) * r;
};

const lerpEulers = (a: Euler, b: Euler, r: number) => {
  return new Euler(
    lerp(a.x, b.x, r),
    lerp(a.y, b.y, r),
    lerp(a.z, b.z, r),
    a.order
  );
};

export default (props: MainProps) => {
  const { size } = props;
  const chunkSize = 32;
  const target = new Vector3(
    (size[0] * chunkSize) / 2,
    chunkSize / 2,
    (size[2] * chunkSize) / 2
  );

  const distance = 400;
  const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");
  const [rotation, setRotation] = useState(initialRotation);
  const [targetRotation, setTargetRotation] = useState(initialRotation);

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = keycode(e);
    if (key === "q") {
      const next = targetRotation.clone();
      next.y += Math.PI / 2;
      setTargetRotation(next);
    } else if (key === "e") {
      const next = targetRotation.clone();
      next.y -= Math.PI / 2;
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

  return (
    <>
      <ambientLight color={0x999999} />
      <directionalLight position={[8, 3, 2]} intensity={0.6} />
      <Planet size={size} seed={1337} />
      <Camera {...{ target, distance, rotation }} />
    </>
  );
};
