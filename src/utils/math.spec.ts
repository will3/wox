import seedrandom from "seedrandom";
import { shuffleArray } from "./math";

describe("#shuffleArray", () => {
    it("shuffles array", () => {
        const seed = seedrandom();
        const array = [];
        const size = 100;
        for (let i = 0; i < size; i++) {
            array.push(i);
        }
        const shuffled = shuffleArray(seed, array);

        for (const value of array) {
            expect(shuffled).toContain(value);
        }
    });
});