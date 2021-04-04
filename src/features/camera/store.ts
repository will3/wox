import { groundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";
import { chunkSize } from "../../constants";
import { EulerValue, Vector3Value } from "../../utils/math";

const initialRotation: EulerValue = [-Math.PI / 4, Math.PI / 4, 0, "YXZ"];

const size = groundStore.size;

const target: Vector3Value = [
  (size.x * chunkSize) / 2,
  ((size.y - 1) * chunkSize) / 2,
  (size.z * chunkSize) / 2,
];

export class CameraStore {
  rotation= initialRotation;
  targetRotation= initialRotation;
  target = target;
  distance = 400;

  constructor() {
    makeAutoObservable(this);
  }

  setTargetRotation(targetRotation: EulerValue) {
    this.targetRotation = targetRotation;
  }

  setDistance(distance: number) {
    this.distance = distance;
  }
}

export const cameraStore = new CameraStore();
