import { useEffect } from "react";
import { useStore } from "./store";
import { useThree } from "react-three-fiber";
import { Raycaster, Color, Vector3, Vector2, Euler, Quaternion } from "three";
import React from "react";

export default () => {
  const mouse = useStore((state) => state.mouse);
  const { camera, scene } = useThree();
  const chunks = useStore((state) => state.chunks);
  const setHighlight = useStore((state) => state.setHighlight);
  const highlight = useStore((state) => state.highlight);

  useEffect(() => {
    const ray = new Raycaster();
    ray.setFromCamera(mouse, camera);
    const intersects = ray.intersectObjects(scene.children);
    if (intersects.length === 0) {
      return;
    }

    const intersect = intersects[0];
    const userData = intersect.object.userData;
    if (!userData.isChunkMesh) {
      return;
    }

    const origin = userData.origin;
    const faceIndex = intersect.faceIndex;
    if (faceIndex == null) {
      return;
    }

    const chunk = chunks.getChunk(origin);
    if (chunk == null || chunk.meshData == null) {
      return;
    }

    const result = chunk.meshData.faces[faceIndex];

    const worldCoord = new Vector3()
      .fromArray(chunk.origin)
      .add(new Vector3().fromArray(result.coord));

    setHighlight({
      coord: worldCoord.toArray() as [number, number, number],
      normal: result.normal as [number, number, number],
    });
  }, [mouse]);

  if (highlight == null) {
    return null;
  }

  const coordCenter = new Vector3()
    .fromArray(highlight.coord)
    .add(new Vector3(0.5, 0.5, 0.5));
  const normalVector = new Vector3().fromArray(highlight.normal);

  const position = coordCenter
    .clone()
    .add(normalVector.clone().multiplyScalar(0.5 + 0.01));

  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 0, 1),
    normalVector
  );

  return (
    <mesh position={position} quaternion={quaternion}>
      <planeGeometry args={[1, 1]} attach="geometry"></planeGeometry>
      <meshBasicMaterial color={new Color(1.0, 0.0, 1.0)} attach="material" />
    </mesh>
  );
};
