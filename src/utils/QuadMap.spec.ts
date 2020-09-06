import QuadMap from "./QuadMap";
import { Vector3, Vector2 } from "three";

test("get", () => {
  const quadMap = new QuadMap();
  quadMap.set(new Vector3(33, 34, 35), 123);
  const result = quadMap.get(new Vector3(33, 34, 35));
  expect(result).toEqual(123);
});

test("getOriginsToSearch", () => {
  const quadMap = new QuadMap();
  const origins = quadMap
    .getOriginsToSearch(new Vector3(32, 0, 32), 1)
    .map((x) => `${x.x},${x.y}`);

  expect(origins).toContain("0,0");
  expect(origins).toContain("0,32");
  expect(origins).toContain("32,0");
  expect(origins).toContain("32,32");
});

test("search within range", () => {
  const quadMap = new QuadMap();
  quadMap.set(new Vector3(33, 33, 33), 1);
  const results = quadMap.find(new Vector3(32, 32, 32), 2);
  expect(results).toHaveLength(1);
  const result = results[0];
  expect(result).toEqual(1);
});

test("search outside range", () => {
  const quadMap = new QuadMap();
  quadMap.set(new Vector3(33, 33, 33), 1);
  const results = quadMap.find(new Vector3(32, 32, 32), 1);
  expect(results).toHaveLength(0);
});

test("visit", () => {
  const quadMap = new QuadMap<number>();
  quadMap.set(new Vector3(33, 33, 33), 1);
  const items: number[] = [];
  quadMap.visit((item) => {
    items.push(item);
  });
  expect(items).toHaveLength(1);
  const item = items[0];
  expect(item).toEqual(1);
});
