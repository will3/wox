import create from "zustand";
import { Euler, Vector3, Vector2, Color } from "three";
import ChunksData from "../Chunks/ChunksData";
import { chunkSize } from "../constants";
import Layers from "../Layers";
import QuadMap from "../utils/QuadMap";
import { TreeData } from "../Trees/TreeData";
import { WaterfallData } from "../Waterfalls/WaterfallData";
import { HoverState } from "../HoverState";
import Curve from "../utils/Curve";

export interface State {
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
  mouse: Vector2;
  setMouse(mouse: Vector2): void;
  chunks: ChunksData[];
  hover: HoverState | null;
  setHover(hover: HoverState | null): void;
  size: Vector3;
  treeMap: QuadMap<TreeData>;
  sunColor: Color;
  ambient: Color;
  waterLevel: number;
  waterColor: Color;
  waterAlpha: number;
  addWaterfall(waterfall: WaterfallData): void;
  waterfalls: { [key: string]: WaterfallData };
  groundCurve: Curve;
  grounds: { byId: { [id: string]: GroundData } };
  addGrounds(origins: Vector3[]): void;
  incrementGroundVersion(id: string): void;
}

export interface GroundData {
  origin: Vector3;
  version: number;
}

const treesChunk = new ChunksData(chunkSize, Layers.trees);
treesChunk.normalBias = 0.8;

const waterChunk = new ChunksData(chunkSize, Layers.water);
waterChunk.isWater = true;
waterChunk.normalBias = 1.0;
waterChunk.skyBias = 1.0;
waterChunk.offset = [0, -0.5, 0];

const structureChunks = new ChunksData(chunkSize, Layers.structures);
structureChunks.renderAllSurfaces = true;

export const useStore = create<State>((set, get) => ({
  lightDir: new Vector3(-1, -1, -1),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
  mouse: new Vector2(),
  setMouse: (mouse: Vector2) => {
    set({ mouse });
  },
  chunks: [
    new ChunksData(chunkSize, Layers.ground),
    treesChunk,
    waterChunk,
    structureChunks,
  ],
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
  size: new Vector3(5, 2, 5),
  treeMap: new QuadMap(),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
  waterColor: new Color(0.08, 0.12, 0.2),
  waterAlpha: 0.4,
  waterLevel: 12,
  groundCurve: new Curve([-1, -0.4, 0.5, 2], [-1, -0.45, -0.35, 1.5]),
  addWaterfall: (waterfall: WaterfallData) =>
    set((state) => {
      const waterfalls = Object.assign({}, state.waterfalls, {
        [waterfall.key]: waterfall,
      });
      return { waterfalls };
    }),
  waterfalls: {},
  grounds: {
    byId: {},
  },
  addGrounds(origins: Vector3[]) {
    const grounds = get().grounds;

    const byId = grounds.byId;
    for (const origin of origins) {
      const key = origin.toArray().join(",");
      if (byId[key] == null) {
        byId[key] = {
          origin,
          version: 0,
        };
      }
    }

    set({ grounds });
  },
  incrementGroundVersion(id: string) {
    const grounds = get().grounds;
    grounds.byId[id].version++;

    set({ grounds });
  },
}));
