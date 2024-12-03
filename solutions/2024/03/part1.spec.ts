import { expect } from "chai";

import solver from "./part1.js";

const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

export function sampleInput(): void {
    expect(solver(input)).to.equal(161);
}
