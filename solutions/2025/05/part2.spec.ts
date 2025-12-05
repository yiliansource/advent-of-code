import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
    expect(solver(input)).to.equal(14);
}

export function disjointRanges1() {
    const input = `0-10
20-30`;
    expect(solver(input)).to.equal(22);
}

export function disjointRanges2() {
    const input = `20-30
0-10`;
    expect(solver(input)).to.equal(22);
}

export function leftOverlap() {
    const input = `10-20
5-15`;
    expect(solver(input)).to.equal(16);
}

export function rightOverlap() {
    const input = `10-20
15-25`;
    expect(solver(input)).to.equal(16);
}
