import React, { useEffect } from "react";
import { ChunkData } from "../Chunks";
import { Vector3, Color } from "three";
import { Noise } from "../Noise";
import { useStore } from "../stores/store";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import seedrandom from "seedrandom";
import placeTree from "../Trees/placeTree";
import QuadMap from "../utils/QuadMap";
import ChunksData from "../Chunks/ChunksData";
import Curve from "../utils/Curve";
import { useChunkStore } from "../stores/chunk";
import { TreeData, useTreeStore } from "../stores/tree";
import { useWaterStore } from "../stores/water";

export interface PlanetProps {
  size: Vector3;
  seed: number;
}

export default (props: PlanetProps) => {
  const { size, seed } = props;
  const maxHeight = 64;

  const groundChunks = useChunkStore((state) => state.chunks[Layers.ground]);
  const treeChunks = useChunkStore((state) => state.chunks[Layers.trees]);
  const waterChunks = useChunkStore((state) => state.chunks[Layers.water]);
  const treeMap = useTreeStore((state) => state.treeMap);
  const waterLevel = useWaterStore((state) => state.waterLevel);
  const waterColor = useWaterStore((state) => state.waterColor);
  const groundCurve = useStore((state) => state.groundCurve);
  const updateMeshData = useChunkStore((state) => state.updateMeshData);

  const rng = seedrandom(seed.toString());

  const noise = new Noise({
    scale: new Vector3(1, 0.6, 1),
    seed: rng().toString(),
  });

  const bounds = {
    min: new Vector3(0, 0, 0),
    max: size.clone().multiplyScalar(chunkSize),
  };

  const addGrounds = useStore((state) => state.addGrounds);
  const incrementGroundVersion = useStore(
    (state) => state.incrementGroundVersion
  );

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

    for (const origin of origins) {
      const chunk = groundChunks.getOrCreateChunk(
        origin.toArray() as [number, number, number]
      );
      generateGround(chunk, maxHeight, noise, rockColor, groundCurve);
      const id = origin.toArray().join(",");
      incrementGroundVersion(id);
    }

    groundChunks.visitChunk((chunk) => {
      generateGrass(chunk, grassColor, waterLevel);
    });

    groundChunks.visitChunk((chunk) => {
      updateMeshData(chunk.layer, chunk.key);
    });

    // Place trees
    treeMap.visit((tree) => {
      const { size, normal, position } = tree;
      placeTree(treeChunks, position, normal, size, bounds);
    });

    groundChunks.visitChunk((chunk) => {
      generateWater(
        chunk.origin,
        waterLevel,
        groundChunks,
        waterChunks,
        waterColor
      );
    });
  }, [seed]);

  const rockColor = new Color(0.072, 0.08, 0.09);
  const grassColor = new Color(0.08, 0.1, 0.065);

  return null;
};

const generateGround = (
  chunk: ChunkData,
  maxHeight: number,
  noise: Noise,
  rockColor: Color,
  groundCurve: Curve
) => {
  console.log(`Generated chunk ${chunk.key}`);
  const origin = new Vector3().fromArray(chunk.origin);
  for (let i = 0; i < chunk.size; i++) {
    for (let j = 0; j < chunk.size; j++) {
      const absY = origin.y + j;
      const relY = absY / maxHeight;
      for (let k = 0; k < chunk.size; k++) {
        const gradient = (-relY * 2 + 1) * 0.75;
        const position = new Vector3().fromArray([i, j, k]).add(origin);
        let nv = noise.get(position);
        nv = groundCurve.sample(nv);
        const v = nv + gradient;
        chunk.setColor(i, j, k, rockColor.toArray());
        chunk.set(i, j, k, v);
      }
    }
  }
};

const generateGrass = (
  chunk: ChunkData,
  grassColor: Color,
  waterLevel: number
) => {
  for (let i = 0; i < chunk.size; i++) {
    for (let j = 0; j < chunk.size; j++) {
      for (let k = 0; k < chunk.size; k++) {
        const absY = chunk.origin[1] + j;
        if (absY <= waterLevel) {
          continue;
        }
        const normal = chunk.calcNormal(i, j, k);
        const dot = new Vector3(0, -1, 0).dot(new Vector3().fromArray(normal));
        if (dot > 0.75) {
          chunk.setColor(i, j, k, grassColor.toArray());
        }
      }
    }
  }
};

const generateWater = (
  origin: [number, number, number],
  waterLevel: number,
  groundChunks: ChunksData,
  waterChunks: ChunksData,
  waterColor: Color
) => {
  if (origin[1] > waterLevel) {
    return;
  }

  const groundChunk = groundChunks.getChunk(origin);
  const chunk = waterChunks.getOrCreateChunk(origin);

  for (let i = 0; i < chunk.size; i++) {
    for (let j = 0; j < chunk.size; j++) {
      for (let k = 0; k < chunk.size; k++) {
        const absY = j + origin[1];
        if (absY > waterLevel) {
          chunk.set(i, j, k, 0);
          continue;
        }
        const v = groundChunk.get(i, j, k)!;
        if (v > 0) {
          chunk.set(i, j, k, 0);
          continue;
        }
        chunk.set(i, j, k, 1);
        chunk.setColor(i, j, k, waterColor.toArray());
      }
    }
  }
};
