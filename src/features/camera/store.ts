import { GroundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";
import { chunkSize } from "../../constants";
import { EulerValue, Vector3Value } from "../../utils/math";

const initialRotation: EulerValue = [-Math.PI / 4, Math.PI / 4, 0, "YXZ"];

export class CameraStore {
  rotation = initialRotation;
  targetRotation = initialRotation;
  target: [number, number, number] = [0, 0, 0];
  distance = 400;

  constructor(groundStore: GroundStore) {
    makeAutoObservable(this);
    const size = groundStore.numChunks;
    this.target = [
      (size.x * chunkSize) / 2,
      ((size.y - 1) * chunkSize) / 2,
      (size.z * chunkSize) / 2,
    ]
  }

  setTargetRotation(targetRotation: EulerValue) {
    this.targetRotation = targetRotation;
  }

  setDistance(distance: number) {
    this.distance = distance;
  }
}
