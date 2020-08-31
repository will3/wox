import QuadTree from "./QuadTree";
import { Vector3 } from "three";

test("get", () => {
  const quadTree = new QuadTree();
  quadTree.set(new Vector3(33, 34, 35), 123);
  const result = quadTree.get(new Vector3(33, 34, 35));
  expect(result).toEqual(123);
});
