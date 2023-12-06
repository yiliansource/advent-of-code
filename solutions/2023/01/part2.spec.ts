import { expect } from "chai";

import solver from "./part2.js";

const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(281);
}
