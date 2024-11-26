import { expect } from "chai";

import solver from "./part1.js";

export function simpleCases() {
    expect(solver("HASH")).to.equal(52);
}

export function sampleInput() {
    expect(solver("rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7")).to.equal(1320);
}
