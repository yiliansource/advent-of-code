import { expect } from "chai";

import solver from "./part1.js";
import dedent from "dedent-js";

export function sampleInputs() {
    expect(
        solver(dedent`RL

    AAA = (BBB, CCC)
    BBB = (DDD, EEE)
    CCC = (ZZZ, GGG)
    DDD = (DDD, DDD)
    EEE = (EEE, EEE)
    GGG = (GGG, GGG)
    ZZZ = (ZZZ, ZZZ)`)
    ).to.equal(2);

    expect(
        solver(dedent`LLR

    AAA = (BBB, BBB)
    BBB = (AAA, ZZZ)
    ZZZ = (ZZZ, ZZZ)`)
    ).to.equal(6);
}
