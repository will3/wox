import { Vector2, Camera, Scene, Raycaster, Vector3 } from "three";
import ChunksData from "./features/chunks/ChunksData";
import { HoverState } from "./HoverState";
import getFaceInfo from "./features/chunks/getFaceInfo";

const raycast = (
  mouse: Vector2,
  camera: Camera,
  scene: Scene,
  chunks: ChunksData[],
  layers: number[]
) => {
  const ray = new Raycaster();
  for (const layer of layers) {
    ray.layers.disableAll();
    ray.layers.enable(layer + 1);
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

  const face = getFaceInfo(chunk.meshData, faceIndex);
  if (face == null) {
    return;
  }

  if (chunk.meshData == null) {
    return;
  }

  const voxel = chunk.meshData.voxels[face.voxelIndex];
  const worldCoord = new Vector3()
    .fromArray(chunk.origin)
    .add(new Vector3().fromArray(voxel.coord));

  return {
    coord: worldCoord.toArray() as [number, number, number],
    layer,
    face,
    voxel,
  } as HoverState;
};

export default raycast;
