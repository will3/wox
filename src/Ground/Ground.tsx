import React, { useEffect, useMemo } from "react";
import { Vector2, Vector3 } from "three";
import { Noise } from "../Noise";
import { chunkSize } from "../constants";
import seedrandom from "seedrandom";
import { useGroundStore } from "../stores/ground";
import _ from "lodash";
import GroundChunk from "./GroundChunk";
import { wait } from "./wait";

export interface GroundProps {
  size: Vector3;
  seed: number;
}

export default function Ground(props: GroundProps) {
  const { size, seed } = props;
  const grounds = useGroundStore((state) => state.grounds);
  const addGrounds = useGroundStore((state) => state.addGrounds);
  const generateGround = useGroundStore((state) => state.generateGround);
  const incrementVersion = useGroundStore((state) => state.incrementVersion);
  const generateGrass = useGroundStore((state) => state.generateGrass);
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

  const columns = useMemo(() => {
    const columns: Vector2[] = [];
    for (let i = 0; i < size.x; i++) {
      for (let k = 0; k < size.z; k++) {
        columns.push(new Vector2(i, k).multiplyScalar(chunkSize));
      }
    }
    return columns;
  }, []);

  useEffect(() => {
    addGrounds(origins);
  }, [seed]);

  useEffect(() => {
    (async () => {
      const center = new Vector2(size.x - 1, size.z - 1)
        .multiplyScalar(0.5)
        .multiplyScalar(chunkSize);

      const sorted = columns.sort((a, b) => {
        const dis1 = center.clone().sub(a).length();
        const dis2 = center.clone().sub(b).length();
        const result = dis1 - dis2;
        return result;
      });

      for (const column of sorted) {
        for (let j = 0; j < size.y; j++) {
          const origin = new Vector3(column.x, j * chunkSize, column.y);
          const id = origin.toArray().join(",");
          generateGround(origin);
          incrementVersion(id);
          generateGrass(origin);
        }
        await wait(0);
      }
    })();
  }, []);

  return (
    <>
      {_.map(grounds, (ground) => (
        <GroundChunk key={ground.key} origin={ground.origin} id={ground.key} />
      ))}
    </>
  );
}
