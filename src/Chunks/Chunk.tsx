import ChunkData from "./ChunkData";
import React, { useEffect, useState, useRef } from "react";

import {
  BufferGeometry,
  DataTexture,
  Uniform,
  RGBFormat,
  FloatType,
  Vector3,
  ShaderMaterial,
  UniformsUtils,
  UniformsLib,
  Mesh,
  BufferAttribute,
} from "three";
import { meshChunk, MeshData } from "./meshChunk";
import { useStore } from "../store";
import { useFrame } from "react-three-fiber";

export interface ChunkProps {
  chunk: ChunkData;
}

export default (props: ChunkProps) => {
  const { chunk } = props;

  const vShader = document.getElementById("vertexShader")!.textContent!;
  const fShader = document.getElementById("fragmentShader")!.textContent!;

  useFrame(() => {
    if (!chunk.dirty) {
      return;
    }

    const start = new Date().getTime();
    const meshData = meshChunk(chunk);
    const end = new Date().getTime();
    console.log(
      `Meshed ${chunk.origin.join(",")} ${
        meshData.vertices.length / 3
      } vertices, ${meshData.indices.length / 3} triangles ${end - start}ms`
    );

    chunk.meshData = meshData;

    if (mesh.geometry != null) {
      mesh.geometry.dispose();
    }
    const geometry = new BufferGeometry();
    geometry.setIndex(meshData.indices);
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(meshData.vertices), 3)
    );
    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(meshData.colors), 3)
    );
    geometry.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(meshData.normals), 3)
    );
    geometry.setAttribute(
      "voxelIndex",
      new BufferAttribute(new Uint32Array(meshData.voxelIndexes), 1)
    );

    mesh.geometry = geometry;

    let material = mesh.material as ShaderMaterial;

    const prevTexture = material.uniforms.voxelNormals?.value;
    if (prevTexture != null) {
      prevTexture.dispose();
    }

    const dataTexture = new DataTexture(
      Float32Array.from(meshData.voxelNormals),
      meshData.voxelNormals.length / 3,
      1,
      RGBFormat,
      FloatType
    );

    material.uniforms.voxelNormals = new Uniform(dataTexture);
    material.uniforms.voxelCount = new Uniform(meshData.voxelCount);
    material.uniformsNeedUpdate = true;
    material.needsUpdate = true;

    chunk.dirty = false;
  });

  useEffect(
    () =>
      useStore.subscribe(
        (lightDir) => {
          const material = mesh.material as ShaderMaterial;
          material.uniforms.lightDir = new Uniform(lightDir);
          material.uniformsNeedUpdate = true;
        },
        (state) => state.lightDir
      ),
    []
  );

  const mesh = new Mesh();
  mesh.position.fromArray(chunk.origin);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.userData = {
    isChunkMesh: true,
    origin: chunk.origin,
  };

  const sunColor = new Vector3(8.1, 6.0, 4.2).multiplyScalar(1.0);
  const lightDir = new Vector3(-1.0, -1.0, 1.0).normalize();
  const ambient = new Vector3(1.0, 1.0, 1.0).multiplyScalar(0.1);

  const uniforms = UniformsUtils.merge([
    UniformsLib["lights"],
    {
      sunColor: new Uniform(sunColor),
      lightDir: new Uniform(lightDir),
      ambient: new Uniform(ambient),
    },
  ]);

  mesh.material = new ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    lights: true,
    uniforms,
  });

  return <primitive object={mesh} />;
};
