import { GroundStore } from "features/ground/store";
import { makeAutoObservable } from "mobx";
import { Euler, Vector3 } from "three";
import { chunkSize } from "../../constants";

const initialRotation = new Euler(-Math.PI / 4, Math.PI / 4, 0, "YXZ");

export class CameraStore {
  rotation = initialRotation;
  targetRotation = initialRotation;
  target = new Vector3(0, 0, 0);
  distance = 400;

  constructor(groundStore: GroundStore) {
    makeAutoObservable(this);
    const size = groundStore.numChunks;
    this.target = new Vector3(
      (size.x * chunkSize) / 2,
      ((size.y - 1) * chunkSize) / 2,
      (size.z * chunkSize) / 2,
    );
  }

  get position() {
    return new Vector3(0, 0, 1)
      .applyEuler(this.rotation)
      .multiplyScalar(this.distance)
      .add(this.target);
  }

  setRotation(rotation: Euler) {
    this.rotation = rotation;
  }

  setTargetRotation(targetRotation: Euler) {
    this.targetRotation = targetRotation;
  }

  setDistance(distance: number) {
    this.distance = distance;
  }
}
