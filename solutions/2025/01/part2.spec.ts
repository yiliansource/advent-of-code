import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    expect(solver(input)).to.equal(6);
}

export function multipleRotations() {
    const input = `R200`;
    expect(solver(input)).to.equal(2);
}
