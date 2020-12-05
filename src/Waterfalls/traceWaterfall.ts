import { Vector2, Vector3 } from "three";
import ChunksData from "../features/chunks/ChunksData";
import { WaterfallPoint } from "../stores/waterfall";

const ring = [
  new Vector2(-1, -1),
  new Vector2(0, -1),
  new Vector2(1, -1),
  new Vector2(-1, 1),
  new Vector2(0, 1),
  new Vector2(1, 1),
  new Vector2(-1, 0),
  new Vector2(1, 0),
];

export interface TraceWaterfallResult {
  points: WaterfallPoint[];
  reachedWater: boolean;
}

const traceWaterfall = (
  position: Vector3,
  groundChunks: ChunksData,
  waterLevel: number
): TraceWaterfallResult => {
  let count = 0;

  const value = groundChunks.get(position.x, position.y, position.z)!;
  let pointer: WaterfallPoint = {
    coord: position,
    value,
  };

  const results: WaterfallPoint[] = [pointer];

  let reachedWater = false;
  do {
    const next = findNext(pointer.coord, groundChunks);
    if (next == null) {
      break;
    }
    results.push(next);
    if (next.coord.y <= waterLevel) {
      reachedWater = true;
      break;
    }
    pointer = next;
    count++;
  } while (count < 100);

  return {
    points: results,
    reachedWater,
  };
};

const findNext = (
  from: Vector3,
  groundChunks: ChunksData
): WaterfallPoint | null => {
  const downEmpty = findDownEmpty(from, groundChunks);
  if (downEmpty != null) {
    console.log("down empty");
    return downEmpty;
  }

  const downSolid = findDownSolid(from, groundChunks);
  if (downSolid != null) {
    return downSolid;
  }

  const first = findInRing(from, groundChunks, -1);
  if (first === "never") {
    return null;
  }

  if (first != null) {
    console.log("found point in first ring");
    return first;
  }

  const second = findInRing(from, groundChunks, 0);

  if (second === "never") {
    return null;
  }

  if (second != null) {
    console.log("found point in second ring");
    return second;
  }

  console.log("not found");
  return null;
};

const findInRing = (
  from: Vector3,
  groundChunks: ChunksData,
  y: number
): WaterfallPoint | null | "never" => {
  const results: WaterfallPoint[] = [];
  const v = groundChunks.get(from.x, from.y, from.z)!;

  for (const point of ring) {
    const coord = from.clone().add(new Vector3(point.x, y, point.y));

    const value = groundChunks.get(coord.x, coord.y, coord.z);

    if (value == null) {
      return "never";
    }

    if (!groundChunks.isSurface(coord.x, coord.y, coord.z)) {
      continue;
    }

    if (value < 0) {
      continue;
    }

    if (y === 0 && value > v) {
      continue;
    }

    results.push({
      coord,
      value,
    });
  }

  const result =
    results.sort((a, b) => {
      return a.value - b.value;
    })[0] ?? null;

  if (result == null) {
    return null;
  }

  return result;
};

const findDownEmpty = (from: Vector3, groundChunks: ChunksData) => {
  const down = from.clone().add(new Vector3(0, -1, 0));
  const downV = groundChunks.get(down.x, down.y, down.z);

  if (downV == null) {
    return null;
  }

  if (downV < 0) {
    return {
      coord: down,
      value: downV,
    };
  }

  return null;
};

const findDownSolid = (
  from: Vector3,
  groundChunks: ChunksData
): WaterfallPoint | null => {
  const down = from.clone().add(new Vector3(0, -1, 0));
  if (groundChunks.isSurface(down.x, down.y, down.z)) {
    const value = groundChunks.get(down.x, down.y, down.z)!;
    return {
      coord: down,
      value,
    };
  }

  return null;
};

export default traceWaterfall;
