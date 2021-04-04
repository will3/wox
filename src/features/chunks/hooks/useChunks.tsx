import { useChunksStore } from "StoreProvider";

export function useChunks() {
  const chunksStore = useChunksStore();
  return chunksStore.chunks;
}
