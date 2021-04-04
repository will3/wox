import { DirectionalLight, Vector3, Vector2, CameraHelper } from "three";
import React, { useEffect, useMemo } from "react";
import { useCameraStore } from "../../camera/store";
import { AlwaysLongShadows } from "./AlwaysLongShadows";
import { lightStore } from "../store";
import { observer } from "mobx-react-lite";

export const Light = observer(() => {
  const lightDir = lightStore.lightDir;
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

  const light = useMemo(() => {
    const light = new DirectionalLight()
    light.position.copy(calcPosition());
    light.target.position.set(...target);
    light.castShadow = true;
    light.shadow.mapSize = new Vector2(2048, 2048);
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
