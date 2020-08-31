import QuadTree from "./QuadTree";
import { Vector3, Vector2 } from "three";

test("get", () => {
  const quadTree = new QuadTree();
  quadTree.set(new Vector3(33, 34, 35), 123);
  const result = quadTree.get(new Vector3(33, 34, 35));
  expect(result).toEqual(123);
});

test("getOriginsToSearch", () => {
  const quadTree = new QuadTree();
  const origins = quadTree
    .getOriginsToSearch(new Vector3(32, 0, 32), 1)
    .map((x) => `${x.x},${x.y}`);

  expect(origins).toContain("0,0");
  expect(origins).toContain("0,32");
  expect(origins).toContain("32,0");
  expect(origins).toContain("32,32");
});

test("search within range", () => {
  const quadTree = new QuadTree();
  quadTree.set(new Vector3(33, 33, 33), 1);
  const results = quadTree.find(new Vector3(32, 32, 32), 2);
  expect(results).toHaveLength(1);
  const result = results[0];
  expect(result).toEqual(1);
});

test("search outside range", () => {
  const quadTree = new QuadTree();
  quadTree.set(new Vector3(33, 33, 33), 1);
  const results = quadTree.find(new Vector3(32, 32, 32), 1);
  expect(results).toHaveLength(0);
});
