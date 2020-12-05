import ChunksData from "../features/chunks/ChunksData";
import { Vector3, Matrix4, Color } from "three";
import { VoxelInfo } from "../features/chunks/VoxelInfo";
import Layers from "../Layers";
import { Noise } from "../Noise";
import seedrandom from "seedrandom";
import { randomQuaternion } from "../utils/math";
import { sdBox, opTx } from "../utils/sdf";

const placeRock = (chunks: ChunksData[], coord: Vector3, voxel: VoxelInfo) => {
  const lower = new Vector3(-2, -2, -2);
  const upper = new Vector3(2, 2, 2);

  const groundChunks = chunks[Layers.ground];

  const rng = seedrandom();

  const colorNoise = new Noise({
    seed: rng().toString(),
    frequency: 0.1,
  });

  const size = rng() * 0.5 + 1;
  for (let i = lower.x; i <= upper.x; i++) {
    for (let j = lower.y; j <= upper.y; j++) {
      for (let k = lower.z; k <= upper.z; k++) {
        const p = new Vector3(i, j, k);

        const m = new Matrix4().compose(
          new Vector3(0, 0, 0),
          randomQuaternion(rng),
          new Vector3(1, 1.2, 1.5).multiplyScalar(size)
        );

        const v = -sdBox(opTx(p, m), new Vector3(1, 1, 1));

        const worldCoord = coord.clone().add(p);

        const value =
          groundChunks.get(worldCoord.x, worldCoord.y, worldCoord.z) ?? 0;

        const noiseV = 1 + 0.2 * colorNoise.get(worldCoord);

        if (v > 0) {
          groundChunks.set(
            worldCoord.x,
            worldCoord.y,
            worldCoord.z,
            Math.max(value, v)
          );

          const color = new Color(0.1, 0.11, 0.12).multiplyScalar(noiseV);
          groundChunks.setColor(
            worldCoord.x,
            worldCoord.y,
            worldCoord.z,
            color.toArray()
          );
        }
      }
    }
  }
};

export default placeRock;
