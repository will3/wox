import { useMemo } from "react";
import { Vector3 } from "three";
import { useGroundStore } from "../store";

export function useOrigins() {
  const size = useGroundStore(state => state.size);
  const chunkSize = useGroundStore(state => state.chunkSize);

  const origins = useMemo(() => {
    const origins: Vector3[] = [];
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        for (let k = 0; k < size.z; k++) {
          origins.push(new Vector3(i, j, k).multiplyScalar(chunkSize));
        }
      }
    }
    return origins;
  }, [size]);
  return origins;
}