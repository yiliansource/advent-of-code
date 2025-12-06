import { expect } from "chai";

import solver from "./part1.js";

export function sampleInput() {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
    expect(solver(input)).to.equal(4277556);
}
