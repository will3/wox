import { Vector2 } from "three";
import { HoverState } from "./HoverState";
import { makeAutoObservable } from "mobx";

export class InputStore {
  mouse = new Vector2();
  hover: HoverState | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setMouse(mouse: Vector2) {
    this.mouse = mouse;
  }

  setHover(hover: HoverState) {
    this.hover = hover;
  }
}
