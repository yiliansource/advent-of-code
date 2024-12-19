import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;
    expect(solver(input)).to.equal(16);
}
