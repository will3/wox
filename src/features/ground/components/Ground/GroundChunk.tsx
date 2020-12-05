import { useEffect } from "react";
import { Color, Vector3 } from "three";
import Layers from "../../../../Layers";
import { Noise } from "../../../../Noise";
import { useChunkStore } from "../../../chunks/store";
import { useGroundStore } from "../../store";
import Curve from "../../../../utils/Curve";

export interface GroundChunkProps {
  origin: Vector3;
  id: string;
}

export default function GroundChunk({ id, origin }: GroundChunkProps) {
  return null;
}
