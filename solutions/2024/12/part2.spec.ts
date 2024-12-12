import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput1() {
    const input = `AAAA
BBCD
BBCC
EEEC`;
    expect(solver(input)).to.equal(80);
}

export function sampleInput2() {
    const input = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;
    expect(solver(input)).to.equal(436);
}

export function sampleInput3() {
    const input = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;
    expect(solver(input)).to.equal(236);
}

export function sampleInput4() {
    const input = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;
    expect(solver(input)).to.equal(368);
}

export function sampleInput5() {
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
    expect(solver(input)).to.equal(1206);
}
