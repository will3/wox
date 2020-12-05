import { Vector2, Vector3 } from "three";
import { useCallback, useEffect } from "react";
import { chunkSize } from "../constants";
import _ from "lodash";
import { useGridStore } from "../stores/grid";
import { useGroundStore } from "features/ground/store";

interface GridChunkProps {
  origin: Vector2;
}

export default function GridChunk({
  origin,
}: GridChunkProps) {
  const grounds = useGroundStore((state) => state.grounds);
  const generateGrids = useGridStore((state) => state.generateGrids);

  const generated = useGroundStore(
    useCallback(
      (state) => {
        for (let j = 0; j < state.size.y; j++) {
          const co = new Vector3(origin.x, j * chunkSize, origin.y);
          const key = co.toArray().join(",");
          const ground = state.grounds[key];
          if (ground.version === 0) {
            return false;
          }
        }

        return true;
      },
      [grounds]
    )
  );

  useEffect(() => {
    if (!generated) {
      return;
    }

    generateGrids(origin);
  }, [generated]);

  return null;
}
