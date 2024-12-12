import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput1() {
    const input = `AAAA
BBCD
BBCC
EEEC`;
    expect(solver(input)).to.equal(140);
}

export function sampleInput2() {
    const input = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;
    expect(solver(input)).to.equal(772);
}

export function sampleInput3() {
    const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
    expect(solver(input)).to.equal(1930);
}
