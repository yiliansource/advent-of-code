import { expect } from "chai";

import solver from "./part1.js";

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

export function sampleInput() {
    expect(solver(input)).to.equal(6440);
}
