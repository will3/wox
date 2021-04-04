import { Vector3 } from "three";
import { Noise } from "utils/Noise";
import { groundStore } from "../store";

export function useNoise() {
    const seed = groundStore.seed;

    return new Noise({
        scale: new Vector3(1, 0.6, 1),
        seed,
    })
}