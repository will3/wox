import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import _ from "lodash";
import { useSceneStore } from "./stores/sceneStore";

export default () => {
  const { camera } = useThree();
  const lightDirs = [
    new Vector3(-1, -1, -1),
    new Vector3(1, -1, -1),
    new Vector3(1, -1, 1),
    new Vector3(-1, -1, 1),
  ].map((x) => x.normalize());

  const setLightDir = useSceneStore((state) => state.setLightDir);
  const lightDir = useSceneStore((state) => state.lightDir);

  useFrame(() => {
    const forward = new Vector3(0, 0, 1).applyEuler(camera.rotation).projectOnPlane(new Vector3(0, 1, 0)).normalize();
    const up = new Vector3(0, 1, 0);
    const right = forward.cross(up);

    const d = _.maxBy(lightDirs, (d) => {
      return right.dot(d);
    })!;

    if (!d.equals(lightDir)) {
      setLightDir(d);
    }
  });

  return null;
};
