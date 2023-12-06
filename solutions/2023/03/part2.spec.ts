import { expect } from "chai";

import solver from "./part2.js";

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
    expect(solver("20*5..32*.1")).to.equal(100);
    expect(solver(input)).to.equal(467835);
}
