import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
    expect(solver(input)).to.equal(3749);
}
