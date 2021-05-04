import { useEffect } from "react";
import { Vector2 } from "three";
import React from "react";
import { HighlightHover } from "./HighlightHover";
import { observer } from "mobx-react-lite";
import { useInputStore } from "StoreProvider";

export const UserInput = observer(() => {
  const inputStore = useInputStore();

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    inputStore.setMouse(new Vector2(x, y));
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return (
    <>
      <HighlightHover />
    </>
  );
});
