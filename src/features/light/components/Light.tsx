import { DirectionalLight, Vector3, Vector2, CameraHelper } from "three";
import React, { useEffect } from "react";
import { useCameraStore } from "../../camera/store";
import { useLightStore } from "../store";
import { AlwaysLongShadows } from "./AlwaysLongShadows";

export default () => {
  const lightDir = useLightStore((state) => state.lightDir);
  const target = useCameraStore((state) => state.target);
  const showHelper = false;
  const distance = 150;

  useEffect(() => {
    light.position.copy(calcPosition());
    light.target.position.set(...target);
  }, [lightDir, target]);

  const calcPosition = () => {
    return lightDir
      .clone()
      .multiply(new Vector3(-1, -1, -1))
      .multiplyScalar(distance)
      .add(new Vector3(...target));
  };

  const light = new DirectionalLight();
  light.position.copy(calcPosition());
  light.target.position.set(...target);
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
      <AlwaysLongShadows />
      <primitive object={light} />
      <primitive object={light.target} />
      {showHelper ? <primitive object={helper} /> : null}
    </>
  );
};
