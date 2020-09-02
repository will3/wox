import React, { useEffect, createRef } from "react";
import { Chunks, ChunkData } from "../Chunks";
import { Vector3, Color } from "three";
import { Noise } from "../Noise";
import { useStore } from "../store";
import Mesher from "../Chunks/Mesher";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import seedrandom from "seedrandom";
import placeTree from "../Trees/placeTree";
import { clamp } from "../utils/math";
import Waterfalls from "../Waterfalls/Waterfalls";
import QuadTree from "../utils/QuadTree";
import { TreeData } from "../Trees/TreeData";
import ChunksData from "../Chunks/ChunksData";
import traceWaterfall from "../Waterfalls/traceWaterfall";
import { WaterfallData } from "../Waterfalls/WaterfallData";

export interface PlanetProps {
  size: Vector3;
  seed: number;
}

export default (props: PlanetProps) => {
  const { size, seed } = props;
  const maxHeight = 64;

  const groundChunks = useStore((state) => state.chunks[Layers.ground]);
  const treeChunks = useStore((state) => state.chunks[Layers.trees]);
  const waterChunks = useStore((state) => state.chunks[Layers.water]);
  const treeMap = useStore((state) => state.treeMap);
  const waterLevel = useStore((state) => state.waterLevel);
  const waterColor = useStore((state) => state.waterColor);
  const waterfalls = useStore((state) => state.waterfalls);
  const addWaterfall = useStore((state) => state.addWaterfall);

  const rng = seedrandom(seed.toString());

  const noise = new Noise({
    scale: new Vector3(1, 0.4, 1),
    seed: rng().toString(),
  });

  const waterfallNoise = new Noise({
    seed: rng().toString(),
    frequency: 0.01,
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
          generateChunk(chunk, maxHeight, noise, rockColor);
        }
      }
    }

    groundChunks.visitChunk((chunk) => {
      generateGrass(chunk, grassColor, waterLevel);
    });

    groundChunks.visitChunk((chunk) => {
      chunk.updateMeshData(waterLevel);
    });

    groundChunks.visitChunk((chunk) => {
      console.log(`Generate trees ${chunk.origin.join(",")}`);
      generateTrees(chunk, rng, waterLevel, treeNoise, maxHeight, treeMap);
    });

    // Average tree normals
    treeMap.visit((tree) => {
      const nearbyTrees = treeMap.find(tree.position, 10);
      const averageNormal = new Vector3();
      nearbyTrees.forEach((t) => {
        averageNormal.add(t.normal);
      });
      averageNormal.multiplyScalar(1 / nearbyTrees.length);

      tree.actualNormal = tree.normal.clone().lerp(averageNormal, 0.2);
    });

    // Place trees
    treeMap.visit((tree) => {
      const { size, actualNormal, position } = tree;
      placeTree(treeChunks, position, actualNormal!, size, bounds);
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

    groundChunks.visitChunk((chunk) => {
      generateWaterfalls(
        chunk,
        rng,
        groundChunks,
        addWaterfall,
        waterLevel,
        waterfallNoise,
        maxHeight
      );
    });
  }, [seed]);

  const rockColor = new Color(0.072, 0.07, 0.075);
  const grassColor = new Color(0.08, 0.1, 0.065);

  return (
    <>
      <Mesher chunksList={[groundChunks, treeChunks, waterChunks]} />
      <Waterfalls waterfalls={waterfalls} />
    </>
  );
};

const generateChunk = (
  chunk: ChunkData,
  maxHeight: number,
  noise: Noise,
  rockColor: Color
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
        const v = noise.get(position) + gradient;
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
        const dot = new Vector3(0, -1, 0).dot(normal);
        if (dot > 0.5) {
          chunk.setColor(i, j, k, grassColor.toArray());
        }
      }
    }
  }
};

const generateTrees = (
  chunk: ChunkData,
  rng: seedrandom.prng,
  waterLevel: number,
  treeNoise: Noise,
  maxHeight: number,
  treeMap: QuadTree<TreeData>
) => {
  const meshData = chunk.meshData!;
  const origin = new Vector3().fromArray(chunk.origin);

  if (meshData.faces.length === 0) {
    return;
  }

  const minDistance = 6;

  for (let i = 0; i < meshData.upFaces.length / 24; i++) {
    const index = Math.floor(meshData.upFaces.length * rng());
    const faceIndex = meshData.upFaces[index];
    const face = meshData.faces[faceIndex];

    const voxel = meshData.voxels[face.voxelIndex];
    const position = voxel.coord.clone().add(origin);
    if (position.y < waterLevel + 3) {
      continue;
    }
    const relY = position.y / maxHeight;
    const yFactor = Math.pow(1 - relY, 0.9);
    const voxelNormal = voxel.voxelNormal;
    const up = 1 - clamp(new Vector3(0, -1, 0).dot(voxelNormal), 0, 1);

    const v = -Math.abs(treeNoise.get(position)) * yFactor * up + 0.2;
    if (v > 0) {
      continue;
    }

    const size = 1 + Math.pow(rng(), 1.5) * 0.2;
    const otherTrees = treeMap.find(position, minDistance * size);

    if (otherTrees.length === 0) {
      treeMap.set(position, {
        normal: voxelNormal,
        size,
        position,
      });
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

const generateWaterfalls = (
  chunk: ChunkData,
  rng: seedrandom.prng,
  groundChunks: ChunksData,
  addWaterfall: (waterfall: WaterfallData) => void,
  waterLevel: number,
  waterfallNoise: Noise,
  maxHeight: number
) => {
  const meshData = chunk.meshData!;
  const origin = new Vector3().fromArray(chunk.origin);

  if (meshData.upFaces.length === 0) {
    return;
  }

  const density = 1 / 420;

  for (let i = 0; i < meshData.upFaces.length * density; i++) {
    const index = Math.floor(meshData.upFaces.length * rng());
    const faceIndex = meshData.upFaces[index];
    const face = meshData.faces[faceIndex];
    const voxel = meshData.voxels[face.voxelIndex];

    const position = voxel.coord.clone().add(origin);
    const relY = 1 - position.y / maxHeight;
    const yFactor = clamp((relY - 0.5) * 2, 0, 1);

    const v = -Math.abs(waterfallNoise.get(position)) * yFactor;

    if (v < 0) {
      continue;
    }

    console.log(`Trace waterfall ${position.toArray().join(",")}`);
    const result = traceWaterfall(position, groundChunks, waterLevel);

    if (!result.reachedWater) {
      continue;
    }

    addWaterfall({
      key: position.toArray().join(","),
      position,
      points: result.points,
    });
  }
};
