import { DirectionalLight, Vector3, Vector2, CameraHelper } from "three";
import React, { useEffect, useMemo } from "react";
import { AlwaysLongShadows } from "./AlwaysLongShadows";
import { observer } from "mobx-react-lite";
import { useCameraStore, useLightStore } from "StoreProvider";

export const Light = observer(() => {
  const lightStore = useLightStore();
  const lightDir = lightStore.lightDir;
  const cameraStore = useCameraStore();
  const target = cameraStore.target;
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

  const light = useMemo(() => {
    const light = new DirectionalLight()
    light.position.copy(calcPosition());
    light.target.position.copy(target);
    light.castShadow = true;
    light.shadow.mapSize = new Vector2(1024, 1024);
    light.shadow.normalBias = 0.5;
    light.shadow.bias = 0;

    const camera = light.shadow.camera;
    camera.left = -200;
    camera.right = 200;
    camera.top = 200;
    camera.bottom = -200;
    camera.near = 0.1;
    camera.far = 10000;

    return light;
  }, []);

  const helper = useMemo(() => {
    return new CameraHelper(light.shadow.camera);
  }, [light])

  return (
    <>
      <AlwaysLongShadows />
      <primitive object={light} />
      <primitive object={light.target} />
      {showHelper ? <primitive object={helper} /> : null}
    </>
  );
});
