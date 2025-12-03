import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    expect(solver(input)).to.equal(3121910778619);
}
