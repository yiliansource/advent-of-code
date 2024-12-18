import { expect } from "chai";

import solver from "./part1.js";

export function simpleInput() {
    const input = `Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`;
    expect(solver(input)).to.equal("0,1,2");
}

export function sampleInput() {
    const input = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;
    expect(solver(input)).to.equal("4,6,3,5,6,3,5,2,1,0");
}
