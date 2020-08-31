import React, { useEffect, createRef } from "react";
import { Chunks, ChunkData } from "../Chunks";
import { Vector3 } from "three";
import { Noise } from "../Noise";
import { useStore } from "../store";
import Mesher from "../Chunks/Mesher";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import seedrandom from "seedrandom";
import placeTree from "../Trees/placeTree";
import { clamp } from "../utils/math";

export interface PlanetProps {
  size: Vector3;
  seed: number;
}

export default (props: PlanetProps) => {
  const { size, seed } = props;
  const maxHeight = 64;

  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const treeChunks = useStore((state) => state.chunks[Layers.trees]);
  const treeMap = useStore((state) => state.treeMap);

  const rng = seedrandom(seed.toString());

  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
    seed: rng().toString(),
  });

  const treeNoise = new Noise({
    frequency: 0.005,
    seed: rng().toString(),
  });

  const bounds = {
    min: new Vector3(0, 0, 0),
    max: size.clone().multiplyScalar(chunkSize),
  };

  useEffect(() => {
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        for (let k = 0; k < size.z; k++) {
          const origin = [i, j, k].map((x) => x * chunkSize) as [
            number,
            number,
            number
          ];
          const chunk = groundChunks.getOrCreateChunk(origin);
          generateChunk(chunk);
        }
      }
    }

    groundChunks.visitChunk((chunk) => {
      generateGrass(chunk);
    });

    groundChunks.visitChunk((chunk) => {
      chunk.updateMeshData();
    });

    groundChunks.visitChunk((chunk) => {
      console.log(`Generate trees ${chunk.origin.join(",")}`);
      generateTree(chunk);
    });
  }, [seed]);

  const rockColor: [number, number, number] = [0.072, 0.07, 0.075];
  const grassColor: [number, number, number] = [0.08, 0.1, 0.065];

  const generateChunk = (chunk: ChunkData) => {
    console.log(`Generated chunk ${chunk.key}`);
    const origin = new Vector3().fromArray(chunk.origin);
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        const absY = origin.y + j;
        const relY = absY / maxHeight;
        for (let k = 0; k < chunk.size; k++) {
          const gradient = (-relY * 2 + 1) * 0.75;
          const position = new Vector3().fromArray([i, j, k]).add(origin);
          const v = noise.get(position) + gradient;
          chunk.setColor(i, j, k, rockColor);
          chunk.set(i, j, k, v);
        }
      }
    }
  };

  const generateGrass = (chunk: ChunkData) => {
    for (let i = 0; i < chunk.size; i++) {
      for (let j = 0; j < chunk.size; j++) {
        for (let k = 0; k < chunk.size; k++) {
          const normal = chunk.calcNormal(i, j, k);
          const dot = new Vector3(0, -1, 0).dot(normal);
          if (dot > 0.5) {
            chunk.setColor(i, j, k, grassColor);
          }
        }
      }
    }
  };

  const generateTree = (chunk: ChunkData) => {
    const meshData = chunk.meshData!;
    const origin = new Vector3().fromArray(chunk.origin);

    if (meshData.faces.length === 0) {
      return;
    }

    const minDistance = 4;

    for (let i = 0; i < meshData.upFaces.length / 24; i++) {
      const index = Math.floor(meshData.upFaces.length * rng());
      const faceIndex = meshData.upFaces[index];
      const face = meshData.faces[faceIndex];

      const position = new Vector3().fromArray(face.coord).add(origin);
      const relY = position.y / maxHeight;
      const yFactor = Math.pow(1 - relY, 0.75);
      const voxelNormal = face.voxelNormal;
      const up = clamp(new Vector3(0, -1, 0).dot(voxelNormal), 0, 1);

      const v = (-Math.abs(treeNoise.get(position)) * yFactor) / up + 0.2;
      if (v > 0) {
        continue;
      }

      const size = 1 + Math.pow(rng(), 1.5) * 0.2;
      const otherTrees = treeMap.find(position, minDistance * size);

      if (otherTrees.length === 0) {
        placeTree(treeChunks, position, face.voxelNormal, size, bounds);
        treeMap.set(position, {});
      }
    }
  };

  return (
    <>
      <Mesher />
      <Chunks layer={Layers.ground} />
      <Chunks layer={Layers.trees} />
    </>
  );
};
