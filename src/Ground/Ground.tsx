import React, { useEffect } from "react";
import { Vector3 } from "three";
import { Noise } from "../Noise";
import { chunkSize } from "../constants";
import seedrandom from "seedrandom";
import { useGroundStore } from "../stores/ground";
import _ from "lodash";
import GroundChunk from "./GroundChunk";

export interface GroundProps {
  size: Vector3;
  seed: number;
}

export default function Ground(props: GroundProps) {
  const { size, seed } = props;
  const grounds = useGroundStore((state) => state.grounds);

  const addGrounds = useGroundStore((state) => state.addGrounds);

  useEffect(() => {
    const origins: Vector3[] = [];

    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        for (let k = 0; k < size.z; k++) {
          origins.push(new Vector3(i, j, k).multiplyScalar(chunkSize));
        }
      }
    }

    addGrounds(origins);
  }, [seed]);

  return (
    <>
      {_.map(grounds, (ground) => (
        <GroundChunk key={ground.key} origin={ground.origin} id={ground.key} />
      ))}
    </>
  );
}
