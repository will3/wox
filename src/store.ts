import create from "zustand";
import { Euler, Vector3, Vector2, Color } from "three";
import ChunksData from "./Chunks/ChunksData";
import { chunkSize } from "./constants";
import Layers from "./Layers";
import QuadMap from "./utils/QuadMap";
import { TreeData } from "./Trees/TreeData";
import { WaterfallData } from "./Waterfalls/WaterfallData";
import { HoverState } from "./HoverState";
import Curve from "./utils/Curve";

export interface State {
  camera: CameraState;
  lightDir: Vector3;
  setLightDir(lightDir: Vector3): void;
  setCamera(camera: CameraStateUpdate): void;
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
}

export interface CameraStateUpdate {
  rotation?: Euler;
  targetRotation?: Euler;
  target?: Vector3;
  distance?: number;
}

export interface CameraState {
  rotation: Euler;
  targetRotation: Euler;
  target: Vector3;
  distance: number;
}

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");

const treesChunk = new ChunksData(chunkSize, Layers.trees);
treesChunk.normalBias = 0.8;

const waterChunk = new ChunksData(chunkSize, Layers.water);
waterChunk.isWater = true;
waterChunk.normalBias = 1.0;
waterChunk.skyBias = 1.0;
waterChunk.offset = new Vector3(0, -0.5, 0);

export const useStore = create<State>((set) => ({
  camera: {
    rotation: initialRotation,
    targetRotation: initialRotation,
    target: new Vector3(),
    distance: 400,
  },
  lightDir: new Vector3(-1, -1, -1),
  setLightDir: (lightDir: Vector3) => set({ lightDir }),
  setCamera: (camera: CameraStateUpdate) =>
    set((state) => {
      const next: CameraState = { ...state.camera, ...camera };
      return { camera: next };
    }),
  mouse: new Vector2(),
  setMouse: (mouse: Vector2) => {
    set({ mouse });
  },
  chunks: [new ChunksData(chunkSize, Layers.ground), treesChunk, waterChunk],
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
  size: new Vector3(5, 3, 5),
  treeMap: new QuadMap(),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
  waterColor: new Color(0.08, 0.12, 0.2),
  waterAlpha: 0.4,
  waterLevel: 12,
  groundCurve: new Curve([-1, -0.4, 0.3, 2], [-1, -0.45, -0.35, 2]),
  addWaterfall: (waterfall: WaterfallData) =>
    set((state) => {
      const waterfalls = Object.assign({}, state.waterfalls, {
        [waterfall.key]: waterfall,
      });
      return { waterfalls };
    }),
  waterfalls: {},
}));
