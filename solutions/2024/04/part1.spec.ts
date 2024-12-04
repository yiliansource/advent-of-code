import { expect } from "chai";

import solver from "./part1.js";

const simple = `..X...
.SAMX.
.A..A.
XMAS.S
.X....`;

export function simpleInput(): void {
    expect(solver(simple)).to.equal(4);
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
    expect(solver(sample)).to.equal(18);
}
