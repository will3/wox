import ChunkData from "../ChunkData";
import React, { useEffect, useRef } from "react";

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
  BufferAttribute,
  Mesh,
  Material,
} from "three";
import _ from "lodash";
import { vertexShader, fragmentShader } from "../voxelShader";
import { useChunkStore } from "../store";
import { useWaterStore } from "../../water/water";
import { useLightStore } from "../../../stores/light";

export interface ChunkProps {
  chunk: ChunkData;
}

function Chunk(props: ChunkProps) {
  const { chunk } = props;

  const meshRef = useRef(new Mesh());
  const sunColor = useLightStore((state) => state.sunColor);
  const ambient = useLightStore((state) => state.ambient);
  const waterAlpha = useWaterStore((state) => state.waterAlpha);
  const lightDir = useLightStore.getState().lightDir;
  const version = useChunkStore((state) => {
    const versions = state.chunkVersions[chunk.layer] || {};
    return versions[chunk.key] ?? 0;
  });

  console.log(
    `Rerender chunk ${props.chunk.layer} ${props.chunk.origin.join(",")}`
  );

  const handleLightDirChanged = (lightDir: Vector3) => {
    console.log("handle light dir changed");
    const mesh = meshRef.current;
    const material = mesh.material as ShaderMaterial;
    material.uniforms.lightDir = new Uniform(lightDir);
    material.uniformsNeedUpdate = true;
    material.needsUpdate = true;
  };

  useEffect(
    () =>
      useLightStore.subscribe(
        (lightDir) => handleLightDirChanged(lightDir as Vector3),
        (state) => state.lightDir
      ),
    []
  );

  useEffect(() => {
    const position = new Vector3()
      .fromArray(chunk.origin)
      .add(new Vector3().fromArray(chunk.chunks.offset));
    const mesh = meshRef.current;
    mesh.position.copy(position);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.userData = {
      isChunkMesh: true,
      origin: chunk.origin,
      layer: chunk.layer,
    };

    const uniforms = UniformsUtils.merge([
      UniformsLib["lights"],
      {
        sunColor: new Uniform(sunColor),
        lightDir: new Uniform(lightDir),
        ambient: new Uniform(ambient),
        normalBias: new Uniform(chunk.chunks.normalBias),
        skyBias: new Uniform(chunk.chunks.skyBias),
        waterAlpha: new Uniform(waterAlpha),
        isWater: new Uniform(chunk.chunks.isWater ? 1.0 : 0.0),
      },
    ]);

    mesh.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      lights: true,
      uniforms,
      transparent: chunk.chunks.isWater,
    });
  }, []);

  useEffect(() => {
    const meshData = chunk.meshData;

    console.log(`Update chunk ${chunk.layer} ${chunk.key}`);

    if (meshData == null) {
      return;
    }

    const mesh = meshRef.current;
    mesh.layers.enable(chunk.layer + 1);

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
    geometry.setAttribute(
      "ao",
      new BufferAttribute(new Float32Array(meshData.ao), 1)
    );

    mesh.geometry = geometry;

    const material = mesh.material as ShaderMaterial;

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
  }, [version]);

  useEffect(() => {
    return () => {
      const mesh = meshRef.current;
      const material = mesh.material as ShaderMaterial;
      const texture = material.uniforms.voxelNormals?.value;
      if (texture != null) {
        texture.dispose();
      }
      if (mesh.geometry != null) {
        mesh.geometry.dispose();
      }
      if (mesh.material != null) {
        (mesh.material as Material).dispose();
      }
    };
  }, []);

  return <primitive object={meshRef.current} />;
}

export default React.memo(Chunk);
