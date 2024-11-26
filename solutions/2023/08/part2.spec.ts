import { expect } from "chai";

import solver from "./part2.js";
import dedent from "dedent-js";

export function sampleInput() {
    expect(
        solver(dedent`LR

 11A = (11B, XXX)
 11B = (XXX, 11Z)
 11Z = (11B, XXX)
 22A = (22B, XXX)
 22B = (22C, 22C)
 22C = (22Z, 22Z)
 22Z = (22B, 22B)
 XXX = (XXX, XXX)`)
    ).to.equal(6);
}
