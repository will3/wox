import {
  DirectionalLight,
  Vector3,
  OrthographicCamera,
  Vector2,
  CameraHelper,
} from "three";
import React, { useEffect } from "react";
import { useStore } from "./store";

export default () => {
  const lightDir = useStore((state) => state.lightDir);
  const target = useStore((state) => state.camera.target);
  const showHelper = false;
  const distance = 150;

  useEffect(() => {
    light.position.copy(calcPosition());
    light.target.position.copy(target);
  }, [lightDir, target]);

  const calcPosition = () => {
    return lightDir
      .clone()
      .multiply(new Vector3(-1, -1, -1))
      .multiplyScalar(distance)
      .add(target);
  };

  const light = new DirectionalLight();
  light.position.copy(calcPosition());
  light.target.position.copy(target);
  light.castShadow = true;

  const camera = light.shadow.camera;
  camera.left = -150;
  camera.right = 150;
  camera.top = 150;
  camera.bottom = -150;
  camera.near = 0.1;
  camera.far = 10000;

  light.shadow.mapSize = new Vector2(1024, 1024);
  light.shadow.normalBias = 0.5;
  light.shadow.bias = 0;

  const helper = new CameraHelper(light.shadow.camera);

  return (
    <>
      <primitive object={light} />
      <primitive object={light.target} />
      {showHelper ? <primitive object={helper} /> : null}
    </>
  );
};
