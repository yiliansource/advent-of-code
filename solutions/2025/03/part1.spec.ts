import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    expect(solver(input)).to.equal(357);
}
