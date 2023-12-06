import { expect } from "chai";

import solver from "./part1.js";

const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

export function simpleCases(): void {
    expect(solver("22*..32.#1")).to.equal(23);
}

export function sampleInput(): void {
    expect(solver(input)).to.equal(4361);
}
