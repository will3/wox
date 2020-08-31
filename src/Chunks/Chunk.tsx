import ChunkData from "./ChunkData";
import React, { useEffect } from "react";

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
import { useStore } from "../store";
import _ from "lodash";

export interface ChunkProps {
  chunk: ChunkData;
}

export default (props: ChunkProps) => {
  const { chunk } = props;

  const vShader = document.getElementById("vertexShader")!.textContent!;
  const fShader = document.getElementById("fragmentShader")!.textContent!;

  const mesh = chunk.mesh;

  console.log(`Rerender chunk ${props.chunk.origin.join(",")}`);

  useStore.subscribe(
    () => {
      handleMeshDataUpdated(chunk);
    },
    () => chunk.version
  );

  const handleLightDirChanged = (lightDir: Vector3) => {
    const material = mesh.material as ShaderMaterial;
    material.uniforms.lightDir = new Uniform(lightDir);
    material.uniformsNeedUpdate = true;
    material.needsUpdate = true;
  };

  useEffect(
    () =>
      useStore.subscribe(
        (lightDir) => handleLightDirChanged(lightDir as Vector3),
        (state) => state.lightDir
      ),
    []
  );

  useEffect(() => {
    mesh.position.fromArray(chunk.origin);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.userData = {
      isChunkMesh: true,
      origin: chunk.origin,
      layer: chunk.layer
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

    handleMeshDataUpdated(chunk);
  }, []);

  return <primitive object={mesh} />;
};

const handleMeshDataUpdated = (chunk: ChunkData) => {
  const meshData = chunk.meshData;

  console.log(`Update chunk ${chunk.key} version: ${chunk.version}`);

  if (meshData == null) {
    return;
  }

  const mesh = chunk.mesh;

  mesh.layers.enable(chunk.layer);

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

  const voxelNormals = meshData.voxelNormals;
  if (voxelNormals.length > 0) {
    const textureSize = voxelNormals.length / 3;
    const dataTexture = new DataTexture(
      Float32Array.from(voxelNormals),
      textureSize,
      1,
      RGBFormat,
      FloatType
    );

    material.uniforms.voxelNormals = new Uniform(dataTexture);
  }

  material.uniforms.voxelCount = new Uniform(meshData.voxelCount);
  material.uniformsNeedUpdate = true;
  material.needsUpdate = true;
};
