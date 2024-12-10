import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
    expect(solver(input)).to.equal(81);
}
