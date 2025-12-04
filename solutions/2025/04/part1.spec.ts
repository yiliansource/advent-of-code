import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
    expect(solver(input)).to.equal(13);
}
