import { expect } from "chai";

import solver from "./part2.js";

export function sampleInput() {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
    expect(solver(input)).to.equal(3263827);
}

export function longerNumbers() {
    const input = `   1     1
2000 20000
+    *`;
    expect(solver(input)).to.equal(12);
}
