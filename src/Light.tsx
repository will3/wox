import {
  DirectionalLight,
  Vector3,
  OrthographicCamera,
  Vector2,
  CameraHelper,
} from "three";
import React, { useEffect } from "react";
import { useStore } from "./stores/store";
import { useCameraStore } from "./stores/camera";

export default () => {
  const lightDir = useStore((state) => state.lightDir);
  const target = useCameraStore((state) => state.target);
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
  camera.left = -100;
  camera.right = 100;
  camera.top = 100;
  camera.bottom = -100;
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
