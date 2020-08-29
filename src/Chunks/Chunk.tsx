import ChunkData from "./ChunkData";
import React, { useEffect, useState, useRef } from "react";
import MeshData from "./MeshData";
import {
  BufferGeometry,
  DataTexture,
  Uniform,
  RGBFormat,
  FloatType,
  NearestFilter,
  Vector3,
  ShaderMaterial,
} from "three";
import { meshChunk } from "./meshChunk";
import { useFrame } from "react-three-fiber";

export interface ChunkProps {
  chunk: ChunkData;
}

const vShader = document.getElementById("vertexShader")!.textContent!;
const fShader = document.getElementById("fragmentShader")!.textContent!;

export default (props: ChunkProps) => {
  const { chunk } = props;

  const [meshData, setMeshData] = useState<MeshData>();

  useEffect(() => {
    const meshData = meshChunk(chunk);
    console.log(
      `Meshed ${meshData.vertices.length} vertices, ${meshData.indices.length} indices`
    );
    setMeshData(meshData);
  }, []);

  const shaderMaterialRef = useRef<ShaderMaterial>();

  if (meshData == null) {
    return null;
  }

  const pixelData = meshData.voxelNormals;
  const dataTexture = new DataTexture(
    Float32Array.from(pixelData),
    pixelData.length / 3,
    1,
    RGBFormat,
    FloatType
  );

  const sunColor = new Vector3(0.9, 0.9, 0.9);
  const lightDir = new Vector3(-1.0, -1.0, -1.0).normalize();
  const ambient = new Vector3(0.1, 0.1, 0.1);

  return (
    <mesh position={chunk.origin}>
      <bufferGeometry
        attach="geometry"
        ref={(bufferGeometry: BufferGeometry) => {
          if (bufferGeometry == null) {
            return;
          }
          bufferGeometry.setIndex(meshData.indices);
        }}
      >
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={meshData.vertices.length / 3}
          array={new Float32Array(meshData.vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={meshData.colors.length / 3}
          array={new Float32Array(meshData.colors)}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "normal"]}
          count={meshData.normals.length / 3}
          array={new Float32Array(meshData.normals)}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "voxelIndex"]}
          count={meshData.voxelIndexes.length}
          array={new Uint32Array(meshData.voxelIndexes)}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={vShader}
        fragmentShader={fShader}
        uniforms={{
          voxelNormals: new Uniform(dataTexture),
          voxelCount: new Uniform(meshData.voxelCount),
          sunColor: new Uniform(sunColor),
          lightDir: new Uniform(lightDir),
          ambient: new Uniform(ambient)
        }}
        attach="material"
      />
    </mesh>
  );
};
