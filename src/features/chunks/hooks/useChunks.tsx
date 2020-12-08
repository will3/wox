import { useContext } from "react";
import { ChunksContext } from "../ChunksProvider";

export function useChunks() {
  const value = useContext(ChunksContext);
  return value.chunks;
}
