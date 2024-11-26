import { expect } from "chai";

import solver from "./part2.js";
import dedent from "dedent-js";

export function sampleInput() {
    expect(
        solver(dedent`0 3 6 9 12 15
    1 3 6 10 15 21
    10 13 16 21 30 45`)
    ).to.equal(2);
}
