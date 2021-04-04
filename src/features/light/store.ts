import { makeAutoObservable } from "mobx";
import { Color, Vector3 } from "three";

export class LightStore {
  lightDir = new Vector3(-1, -1, -1);
  sunColor = new Color(8.1, 6.0, 4.2);
  ambient = new Color(0.1, 0.1, 0.1);

  constructor() {
    makeAutoObservable(this);
  }

  setLightDir(lightDir: Vector3) {
    this.lightDir = lightDir;
  }
}

export const lightStore = new LightStore();