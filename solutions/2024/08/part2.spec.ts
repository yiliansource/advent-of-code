import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
    expect(solver(input)).to.equal(34);
}
