import { chunksStore } from "../store";

export function useChunks() {
  return chunksStore.chunks;
}
