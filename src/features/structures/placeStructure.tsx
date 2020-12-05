import ChunksData from "../chunks/ChunksData";
import { Vector3, Color, Euler } from "three";
import Layers from "../chunks/Layers";
import seedrandom from "seedrandom";
import { GridData } from "../grid/store";
import _ from "lodash";
import { ColorValue } from "features/chunks/types";

export default (chunksList: ChunksData[], grids: GridData[]) => {
  const hw = 3;
  const hl = 3;
  const height = 7;
  const doorHeight = 4;
  const lower = new Vector3(-hw, -1, -hl);
  const upper = new Vector3(hw, height, hl);

  const minY = _(grids)
    .map((grid) => grid.coords)
    .flatten()
    .minBy((coord) => coord.y)!.y;

  const origins = grids.map((grid) => grid.origin);
  const coord = new Vector3(
    _(origins)
      .map((origin) => origin.x)
      .min(),
    0,
    _(origins)
      .map((origin) => origin.y)
      .min()
  );

  const offset = new Vector3(hw, minY, hl);

  const chunks = chunksList[Layers.structures];
  const rng = seedrandom();
  const rotation = new Euler(
    0,
    (Math.PI / 2) * Math.floor(rng() * 4),
    0,
    "YXZ"
  );

  for (let x = lower.x; x <= upper.x; x++) {
    for (let y = lower.y; y <= upper.y; y++) {
      for (let z = lower.z; z <= upper.z; z++) {
        const p = new Vector3(x, y, z);
        p.applyEuler(rotation);
        p.x = Math.round(p.x);
        p.y = Math.round(p.y);
        p.z = Math.round(p.z);

        const i = p.x;
        const j = p.y;
        const k = p.z;

        const isChimney = i == 1 && k == 1 && j > 3;

        const disCorner = hw - Math.abs(i) + (height - j);

        if (disCorner < hw && !isChimney) {
          continue;
        }

        if (j < height - hw - 1 && Math.abs(i) == hw) {
          continue;
        }

        const isRoof = disCorner === hw;
        const isDoor = i == 0 && j < doorHeight && (k === hl || k === -hl);
        const roofHue = k % 2;

        const worldCoord = new Vector3(x, y, z).add(coord).add(offset);
        chunks.set(worldCoord.x, worldCoord.y, worldCoord.z, 1);

        let color;
        if (isChimney) {
          color = new Color(0.12, 0.13, 0.15);
        } else if (isRoof) {
          color = new Color(0.1, 0.1, 0.1).multiplyScalar(
            roofHue === 0 ? 0.85 : 1.0
          );
        } else if (isDoor) {
          color = new Color(0.1, 0.1, 0.1);
        } else {
          color = new Color(0.18, 0.18, 0.18);
        }

        chunks.setColor(
          worldCoord.x,
          worldCoord.y,
          worldCoord.z,
          color.getHex()
        );
      }
    }
  }
};
