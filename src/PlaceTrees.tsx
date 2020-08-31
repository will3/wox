import { useStore } from "./store";
import { useEffect } from "react";
import { Vector3, Matrix, Matrix4, Quaternion } from "three";
import { clamp } from "lodash";

const sdVerticalCapsule = (p: Vector3, h: number, r: number): number => {
  p = p.clone();
  p.y -= clamp(p.y, 0.0, h);
  return p.length() - r;
};

const opTx = (p: Vector3, t: Matrix4): Vector3 => {
  return p.clone().applyMatrix4(new Matrix4().getInverse(t));
};

export default function PlaceTrees() {
  const hover = useStore((state) => state.hover);
  const chunks = useStore((state) => state.chunks);

  const handleMouseDown = () => {
    if (hover == null) {
      return;
    }

    const { coord, voxelNormal } = hover;

    const hs = new Vector3(20, 20, 20);

    for (let i = -hs.x; i <= hs.x; i++) {
      for (let j = -hs.y; j <= hs.y; j++) {
        for (let k = -hs.z; k <= hs.z; k++) {
          const p = new Vector3(i, j, k);

          const rotation = new Quaternion().setFromUnitVectors(
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0).lerp(voxelNormal.clone().multiplyScalar(-1), 0.2)
          );

          const m = new Matrix4().compose(
            new Vector3(),
            rotation,
            new Vector3(1, 1, 1)
          );
          const v = clamp(-sdVerticalCapsule(opTx(p, m), 8, 0.75), 0, 1);

          const worldCoord = new Vector3().fromArray(coord).add(p);
          if (v < 0) {
            continue;
          }

          const value =
            chunks.get(worldCoord.x, worldCoord.y, worldCoord.z) ?? 0;
          if (value > 0) {
            continue;
          }

          chunks.set(worldCoord.x, worldCoord.y, worldCoord.z, v * 1);
          chunks.setColor(worldCoord.x, worldCoord.y, worldCoord.z, [
            0.1,
            0.09,
            0.08,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  });

  return null;
}
