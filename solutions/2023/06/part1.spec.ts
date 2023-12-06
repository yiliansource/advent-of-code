import { expect } from "chai";

import solver from "./part1.js";

const input = `Time:      7  15   30
Distance:  9  40  200`;

export default function (): void {
    expect(solver(input)).to.equal(288);
}
