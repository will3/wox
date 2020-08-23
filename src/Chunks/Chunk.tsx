import ChunkData from "./ChunkData";
import React, { useMemo, useEffect, useState } from "react";
import MeshData from "./MeshData";
import { BufferGeometry } from "three";
import { useFrame } from "react-three-fiber";

export interface ChunkProps {
  chunk: ChunkData;
}

export default (props: ChunkProps) => {
  const { chunk } = props;

  const [meshData, setMeshData] = useState<MeshData>();

  useEffect(() => {
    setMeshData(chunk.mesh());
  }, []);

  return meshData == null ? null : (
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
          array={meshData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "normal"]}
          count={meshData.normals.length / 3}
          array={new Float32Array(meshData.normals)}
          itemSize={3}
        />
      </bufferGeometry>
      <meshLambertMaterial color={0x333333} attach="material" />
    </mesh>
  );
};
