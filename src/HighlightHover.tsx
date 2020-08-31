import { useEffect } from "react";
import { useStore, HoverState } from "./store";
import { useThree } from "react-three-fiber";
import {
  Raycaster,
  Color,
  Vector3,
  Quaternion,
  Vector2,
  Camera,
  Scene,
} from "three";
import React from "react";
import ChunksData from "./Chunks/ChunksData";
import Layers from "./Layers";

const raycast = (
  mouse: Vector2,
  camera: Camera,
  scene: Scene,
  chunks: ChunksData[],
  layers: number[]
) => {
  const ray = new Raycaster();
  for (const layer of layers) {
    ray.layers.enable(layer);
  }

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

  const { origin, layer } = userData;
  const faceIndex = intersect.faceIndex;
  if (faceIndex == null) {
    return;
  }

  const chunk = chunks[layer].getChunk(origin);
  if (chunk == null || chunk.meshData == null) {
    return;
  }

  const result = chunk.meshData.faces[faceIndex];

  const worldCoord = new Vector3()
    .fromArray(chunk.origin)
    .add(new Vector3().fromArray(result.coord));

  return {
    coord: worldCoord.toArray() as [number, number, number],
    normal: result.normal as [number, number, number],
    voxelNormal: result.voxelNormal,
  } as HoverState;
};

export default () => {
  const mouse = useStore((state) => state.mouse);
  const { camera, scene } = useThree();
  const chunks = useStore((state) => state.chunks);
  const setHover = useStore((state) => state.setHover);
  const hover = useStore((state) => state.hover);

  useEffect(() => {
    const result = raycast(mouse, camera, scene, chunks, [Layers.ground]);
    if (result != null) {
      setHover(result);
    }
  }, [mouse]);

  if (hover == null) {
    return null;
  }

  const coordCenter = new Vector3()
    .fromArray(hover.coord)
    .add(new Vector3(0.5, 0.5, 0.5));
  const normalVector = new Vector3().fromArray(hover.normal);

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
