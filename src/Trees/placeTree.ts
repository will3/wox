import ChunksData from "../Chunks/ChunksData";
import { Vector3, Quaternion, Matrix4, Vector2 } from "three";
import { clamp } from "lodash";
import { sdVerticalCapsule, opTx, sdCone } from "../utils/sdf";

const placeTree = (
  chunks: ChunksData,
  coord: Vector3,
  voxelNormal: Vector3
) => {
  const lower = new Vector3(-5, -2, -5);
  const upper = new Vector3(5, 14, 5);

  for (let i = lower.x; i <= upper.x; i++) {
    for (let j = lower.y; j <= upper.y; j++) {
      for (let k = lower.z; k <= upper.z; k++) {
        const p = new Vector3(i, j, k);

        const rotation = new Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0),
          new Vector3(0, 1, 0).lerp(voxelNormal.clone().multiplyScalar(-1), 0.3)
        );

        const trunkM = new Matrix4().compose(
          new Vector3(),
          rotation,
          new Vector3(1, 1, 1)
        );
        const trunk = clamp(-sdVerticalCapsule(opTx(p, trunkM), 4, 0.6), 0, 1);

        const leafsM = new Matrix4().compose(
          new Vector3(0, 12, 0).applyQuaternion(rotation),
          rotation,
          new Vector3(1, 1, 1)
        );
        const leafs = clamp(
          -sdCone(opTx(p, leafsM), new Vector2(3.0, 1.0), 10),
          0,
          1
        );

        const worldCoord = coord.clone().add(p);
        if (trunk < 0 && leafs < 0) {
          continue;
        }

        const value = chunks.get(worldCoord.x, worldCoord.y, worldCoord.z) ?? 0;

        if (value > 0) {
          continue;
        }

        const isLeafs = leafs > trunk;

        chunks.set(
          worldCoord.x,
          worldCoord.y,
          worldCoord.z,
          Math.max(value, trunk, leafs)
        );

        const leafColor = [0.06, 0.09, 0.04] as [number, number, number];
        const trunkColor = [0.05, 0.05, 0.05] as [number, number, number];

        if (isLeafs) {
          chunks.setColor(worldCoord.x, worldCoord.y, worldCoord.z, leafColor);
        } else {
          chunks.setColor(worldCoord.x, worldCoord.y, worldCoord.z, trunkColor);
        }
      }
    }
  }
};

export default placeTree;
