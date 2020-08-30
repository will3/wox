import ChunksData from "./ChunksData";

test("get", () => {
  const chunks = new ChunksData();
  const chunk = chunks.getOrCreateChunk([32, 32, 32]);
  chunk.set(1, 2, 3, 1);
  expect(chunks.get(33, 34, 35)).toEqual(1);
});
