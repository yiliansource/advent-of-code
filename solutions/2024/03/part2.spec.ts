import { expect } from "chai";

import solver from "./part2.js";

const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(48);
}
