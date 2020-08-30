import { DirectionalLight, Vector3, OrthographicCamera, Vector2 } from "three";
import React, { useEffect } from "react";
import { useStore } from "./store";

export default () => {
  const lightDir = useStore((state) => state.lightDir);

  useEffect(
    () =>
      useStore.subscribe(
        (lightDir: Vector3 | null) => {
          if (lightDir == null) {
            return;
          }
          light.position.copy(
            lightDir
              .clone()
              .multiply(new Vector3(-1, -1, -1))
              .multiplyScalar(150)
          );
        },
        (state) => state.lightDir
      ),
    []
  );

  const light = new DirectionalLight();
  light.position.copy(
    lightDir.clone().multiply(new Vector3(-1, -1, -1)).multiplyScalar(150)
  );
  light.castShadow = true;
  light.shadow.camera = new OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
  light.shadow.mapSize = new Vector2(1024, 1024);
  light.shadow.normalBias = 0.5;
  light.shadow.bias = 0;
  return <primitive object={light} />;
};
