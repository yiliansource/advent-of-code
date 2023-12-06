import { expect } from "chai";

import solver from "./part1.js";

const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(142);
}
