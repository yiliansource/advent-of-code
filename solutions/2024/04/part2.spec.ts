import { expect } from "chai";

import solver from "./part2.js";

const simple = `M.S
.A.
M.S`;

export function simpleInput(): void {
    expect(solver(simple)).to.equal(1);
}

const sample = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

export function sampleInput(): void {
    expect(solver(sample)).to.equal(9);
}
