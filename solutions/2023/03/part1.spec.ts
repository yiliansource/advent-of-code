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

export default function (): void {
    expect(solver("22*..32.#1")).to.equal(23);
    expect(solver(input)).to.equal(4361);
}
