import { expect } from "chai";

import solver from "./part2.js";

const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(31);
}
