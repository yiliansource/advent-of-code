import { expect } from "chai";

import solver from "./part1.js";

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
    expect(solver(input)).to.equal(3);
}
