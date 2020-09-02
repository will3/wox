import { useStore, HoverState } from "../store";
import { useEffect } from "react";
import { Vector3 } from "three";
import Layers from "../Layers";
import placeTree from "../Trees/placeTree";

export default function PlaceTrees() {
  const chunks = useStore((state) => state.chunks[Layers.trees]);

  let hover: HoverState | null = null;

  useStore.subscribe<HoverState | null>(
    (h) => {
      hover = h;
    },
    (state) => state.hover
  );

  const handleMouseDown = () => {
    if (hover == null) {
      return;
    }

    const { coord, voxelNormal } = hover;

    placeTree(chunks, new Vector3().fromArray(coord), voxelNormal, 1);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null;
}
