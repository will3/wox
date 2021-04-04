import { Vector3 } from "three";
import { Noise } from "utils/Noise";
import { useGroundStore } from "../store";

export function useNoise() {
    const seed = useGroundStore(state => state.seed);

    return new Noise({
        scale: new Vector3(1, 0.6, 1),
        seed,
    })
}