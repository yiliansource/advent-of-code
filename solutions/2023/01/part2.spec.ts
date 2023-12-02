import { expect } from "chai";

import parser from "./parser.js";
import solver from "./part2.js";

const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

export default function (): void {
    expect(solver(parser(input))).to.equal(281);
}
