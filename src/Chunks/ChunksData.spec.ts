import ChunksData from "./ChunksData";

test("get", () => {
  const chunks = new ChunksData();
  const chunk = chunks.getOrCreateChunk([32, 32, 32]);
  chunk.set(1, 2, 3, 1);
  expect(chunks.get(33, 34, 35)).toEqual(1);
});

test("set", () => {
  const chunks = new ChunksData();
  chunks.set(33, 34, 35, 1);
  expect(chunks.get(33, 34, 35)).toEqual(1);
});

test("setColor", () => {
  const chunks = new ChunksData();
  chunks.setColor(33, 34, 35, [1.0, 1.0, 1.0]);
  expect(chunks.getColor(33, 34, 35)).toEqual([1.0, 1.0, 1.0]);
});