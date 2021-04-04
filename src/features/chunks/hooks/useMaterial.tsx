import { useContext, useEffect } from "react";
import { useLightStore, useWaterStore } from "StoreProvider";
import { ShaderMaterial, Uniform, UniformsLib, UniformsUtils } from "three";
import ChunkData from "../ChunkData";
import { ChunksContext } from "../ChunksProvider";
import { vertexShader, fragmentShader } from "../voxelShader";

export function useMaterial() {
  const lightStore = useLightStore();
  const sunColor = lightStore.sunColor;
  const ambient = lightStore.ambient;
  const lightDir = lightStore.lightDir;
  const waterStore = useWaterStore();
  const waterAlpha = waterStore.waterAlpha;

  const { materials } = useContext(ChunksContext);

  useEffect(() => {
    materials.forEach((material) => {
      if (material.uniforms == null) {
        return;
      }
      material.uniforms.lightDir = new Uniform(lightDir);
      material.uniformsNeedUpdate = true;
      material.needsUpdate = true;
    });
  }, [lightDir]);

  function getOrCreateMaterial(chunk: ChunkData) {
    let material = materials.get(chunk.id);
    if (material != null) {
      return material;
    }

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

    material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      lights: true,
      uniforms,
      transparent: chunk.chunks.isWater,
    });

    materials.set(chunk.id, material);

    return material;
  }

  function removeMaterial(chunkId: string) {
    const material = materials.get(chunkId);
    if (material == null) {
      return;
    }
    const texture = material.uniforms.voxelNormals?.value;
    if (texture != null) {
      texture.dispose();
    }
    material.dispose();
  }

  return {
    getOrCreateMaterial,
    removeMaterial,
  };
}
