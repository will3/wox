import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useLightStore } from "StoreProvider";

export const AlwaysLongShadows = observer(() => {
  const { camera } = useThree();
  const lightDirs = [
    new Vector3(-1, -1, -1),
    new Vector3(1, -1, -1),
    new Vector3(1, -1, 1),
    new Vector3(-1, -1, 1),
  ].map((x) => x.normalize());

  const lightStore = useLightStore();
  const lightDir = lightStore.lightDir;

  useFrame(() => {
    const forward = new Vector3(0, 0, 1)
      .applyEuler(camera.rotation)
      .projectOnPlane(new Vector3(0, 1, 0))
      .normalize();

    const up = new Vector3(0, 1, 0);
    const right = forward.cross(up);

    const d = _.maxBy(lightDirs, (d) => {
      return right.dot(d);
    })!;

    if (!d.equals(lightDir)) {
      lightStore.setLightDir(d);
    }
  });

  return null;
});