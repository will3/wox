import ChunksData from "./ChunksData";

test("get", () => {
  const chunks = new ChunksData(32);
  const chunk = chunks.getOrCreateChunk([32, 32, 32]);
  chunk.set(1, 2, 3, 1);
  expect(chunks.get(33, 34, 35)).toEqual(1);
});

test("set", () => {
  const chunks = new ChunksData(32);
  chunks.set(33, 34, 35, 1);
  expect(chunks.get(33, 34, 35)).toEqual(1);
});

test("setColor", () => {
  const chunks = new ChunksData(32);
  chunks.setColor(33, 34, 35, [1.0, 1.0, 1.0]);
  expect(chunks.getColor(33, 34, 35)).toEqual([1.0, 1.0, 1.0]);
});

test("isSurface true", () => {
  const chunks = new ChunksData(32);
  chunks.set(1, 2, 3, 4);

  // set at least one empty space
  chunks.set(0, 2, 3, -1);

  expect(chunks.isSurface(1, 2, 3)).toEqual(true);
});

test("isSurface false", () => {
  const chunks = new ChunksData(32);
  chunks.set(1, 2, 3, 4);

  // surround the voxel
  chunks.set(0, 2, 3, 4);
  chunks.set(2, 2, 3, 4);
  chunks.set(1, 1, 3, 4);
  chunks.set(1, 3, 3, 4);
  chunks.set(1, 2, 2, 4);
  chunks.set(1, 2, 4, 4);

  expect(chunks.isSurface(1, 2, 3)).toEqual(false);
});
