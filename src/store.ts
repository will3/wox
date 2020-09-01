import create from "zustand";
import { Euler, Vector3, Vector2, Color } from "three";
import ChunksData from "./Chunks/ChunksData";
import { chunkSize } from "./constants";
import Layers from "./Layers";
import QuadTree from "./utils/QuadTree";
import { Tree } from "./Trees/Tree";

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
  treeMap: QuadTree<Tree>;
  sunColor: Color;
  ambient: Color;
}

export interface HoverState {
  coord: [number, number, number];
  normal: [number, number, number];
  voxelNormal: Vector3;
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
  chunks: [
    new ChunksData(chunkSize, Layers.ground),
    treesChunk,
  ],
  hover: null,
  setHover: (hover: HoverState) => set({ hover }),
  size: new Vector3(5, 3, 5),
  treeMap: new QuadTree(),
  sunColor: new Color(8.1, 6.0, 4.2),
  ambient: new Color(0.1, 0.1, 0.1),
}));
