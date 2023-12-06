import { expect } from "chai";

import solver from "./part2.js";

const input = `Time:      7  15   30
Distance:  9  40  200`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(71503);
}
