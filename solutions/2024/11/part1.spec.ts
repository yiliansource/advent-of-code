import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `125 17`;
    expect(solver(input)).to.equal(55312);
}
