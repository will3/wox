import ChunkData from "../ChunkData";
import React, { useEffect, useRef } from "react";

import {
  BufferGeometry,
  DataTexture,
  Uniform,
  RGBFormat,
  FloatType,
  Vector3,
  BufferAttribute,
  Mesh,
} from "three";
import { observer } from "mobx-react-lite";
import { useChunksStore } from "StoreProvider";
import { useMaterial } from "../hooks/useMaterial";

export interface ChunkProps {
  chunk: ChunkData;
}

export const Chunk = observer((props: ChunkProps) => {
  const { chunk } = props;

  const meshRef = useRef(new Mesh());
  const chunksStore = useChunksStore();
  const version = chunksStore.getChunkVersion(chunk.id);
  const { getOrCreateMaterial, removeMaterial } = useMaterial();

  console.log(
    `Rerender chunk ${props.chunk.layer} ${props.chunk.origin.join(",")}`
  );

  useEffect(() => {
    meshRef.current.visible = !chunk.hidden;
  }, [chunk.hidden]);

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

    const material = getOrCreateMaterial(chunk);
    mesh.material = material;

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
      if (mesh.geometry != null) {
        mesh.geometry.dispose();
      }

      removeMaterial(chunk.id);
    };
  }, []);

  return <primitive object={meshRef.current} />;
});
