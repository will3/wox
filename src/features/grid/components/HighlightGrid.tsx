import { useEffect, useState } from "react";
import raycast from "../../../utils/raycast";
import { useThree } from "react-three-fiber";
import Layers from "../../chunks/Layers";
import { Vector2, Vector3, Geometry, Face3 } from "three";
import { gridSize } from "../constants";
import React from "react";
import { observer } from "mobx-react-lite";
import { useChunksStore, useGridStore, useInputStore } from "StoreProvider";

const twoByTwo = {
  coords: [
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(1, 1),
    new Vector2(0, 1),
  ],
  center: new Vector2(0.5, 0.5),
};

export const HighlightGrid = observer(() => {
  const inputStore = useInputStore();
  const gridStore = useGridStore();
  const chunksStore = useChunksStore();

  const mouse = inputStore.mouse;
  const grids = gridStore.grids;
  const gridIds = gridStore.gridIds;
  const [geometry, setGeometry] = useState(new Geometry());

  const { camera, scene } = useThree();

  useEffect(() => {
    const result = raycast(mouse, camera, scene, chunksStore.chunksList, [Layers.ground]);
    if (result == null) {
      return;
    }

    const v = new Vector2(result.coord[0], result.coord[2]);
    const vs = twoByTwo.coords.map((x) => {
      return x.clone().sub(twoByTwo.center).multiplyScalar(gridSize).add(v);
    });
    const gos = vs.map((x) => getGrid(x));

    const gridIds = gos
      .filter((x) => {
        const id = x.toArray().join(",");
        return grids[id] != null;
      })
      // Sort by x then z
      .sort((a, b) => {
        const xd = a.x - b.x;
        if (xd != 0) {
          return xd;
        }
        return a.y - b.y;
      })
      .map((x) => x.toArray().join(","));

    gridStore.setGridIds(gridIds);
  }, [mouse]);

  useEffect(() => {
    if (gridIds?.length === 0) {
      return;
    }

    const geometry = new Geometry();
    const vertices: Vector3[] = [];
    const faces: Face3[] = [];

    for (const gridId of gridIds) {
      const grid = grids[gridId];
      if (grid == null) {
        continue;
      }
      for (const coord of grid.coords) {
        addPlane(vertices, faces, coord, new Vector3(0, 0.1, 0));
      }
    }

    geometry.vertices = vertices;
    geometry.faces = faces;

    setGeometry(geometry);
  }, [gridIds]);

  return <mesh geometry={geometry} />;
});

function addPlane(
  vertices: Vector3[],
  faces: Face3[],
  coord: Vector3,
  offset: Vector3
) {
  const vs = [
    new Vector3(0, 1, 0),
    new Vector3(1, 1, 0),
    new Vector3(1, 1, 1),
    new Vector3(0, 1, 1),
  ];

  vs.forEach((v) => {
    v.add(coord).add(offset);
  });

  const index = vertices.length;
  vertices.push(...vs);
  faces.push(new Face3(index, index + 1, index + 2));
  faces.push(new Face3(index + 2, index + 3, index));
  faces.push(new Face3(index + 2, index + 1, index));
  faces.push(new Face3(index, index + 3, index + 2));
}

function getGrid(coord: Vector2) {
  return new Vector2(
    Math.floor(coord.x / gridSize) * gridSize,
    Math.floor(coord.y / gridSize) * gridSize
  );
}
