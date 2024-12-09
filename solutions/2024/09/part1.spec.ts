import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `2333133121414131402`;
    expect(solver(input)).to.equal(1928);
}
