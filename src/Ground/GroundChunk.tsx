import { useEffect } from "react";
import { Color, Vector3 } from "three";
import { ChunkData } from "../Chunks";
import Layers from "../Layers";
import { Noise } from "../Noise";
import { useChunkStore } from "../stores/chunk";
import { useGroundStore } from "../stores/ground";
import Curve from "../utils/Curve";

export interface GroundChunkProps {
  origin: Vector3;
  id: string;
}

export default function GroundChunk({ id, origin }: GroundChunkProps) {
  return null;
}
