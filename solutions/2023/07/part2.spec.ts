import { expect } from "chai";

import solver from "./part2.js";

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

export function simpleCases() {
    expect(solver("223JT 1\n2233T 10")).to.equal(12);
    expect(solver("223JJ 1\n22333 10")).to.equal(12);
    expect(solver("QQQQ2 1\nJKKK2 10")).to.equal(12);
}

export function sampleInput() {
    expect(solver(input)).to.equal(5905);
}
