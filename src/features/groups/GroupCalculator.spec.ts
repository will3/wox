import ChunksData from "features/chunks/ChunksData";
import { GroupCalculator } from "./GroupCalculator";

it("Calculate group", () => {
    const chunks = new ChunksData(2);
    const chunk = chunks.getOrCreateChunk([0, 0, 0]);
    chunk.set(0, 0, 0, 1);
    const groupCalculator = new GroupCalculator(chunk);
    const groups = groupCalculator.calcGroups();
    expect(groups).toHaveLength(1);
    const group = groups[0];
    expect(group.coords.map(x => x.toArray())).toEqual([[0, 0, 0]]);
});