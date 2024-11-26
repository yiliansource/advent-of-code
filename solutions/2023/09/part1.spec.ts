import { expect } from "chai";

import solver from "./part1.js";
import dedent from "dedent-js";

export function simpleCases() {
    expect(solver(dedent`2 6 10 14 18 22 26 30 34 38 42 46 50 54 58 62 66 70 74 78 82`)).to.equal(86);
}

export function toughCases() {
    expect(
        solver(
            dedent`25 37 45 57 103 257 670 1617 3564 7271 13964 25633 45561 79327 136917 237555 421062 774117 1488793 2987794 6182124`
        )
    ).to.equal(12982783);
}

export function sampleInput() {
    expect(
        solver(dedent`0 3 6 9 12 15
    1 3 6 10 15 21
    10 13 16 21 30 45`)
    ).to.equal(114);
}
