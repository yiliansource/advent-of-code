import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;
    expect(solver(input)).to.equal(117440);
}
