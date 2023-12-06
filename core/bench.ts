import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import { formatDuration } from "./lib/format.js";
import { dynamicImportDayScript, getEnvironmentDir } from "./lib/paths.js";
import { withPerformance } from "./lib/performance.js";
import { sleep } from "./lib/promise.js";
import { PartSolver } from "./lib/types.js";
import "dotenv/config";

makeBanner();

const argv = yargs(hideBin(process.argv))
    .option("year", {
        type: "number",
        alias: ["y"],
        default: new Date().getFullYear(),
        description: "The year to target.",
    })
    .option("day", {
        type: "number",
        alias: ["d"],
        default: new Date().getDate(),
        description: "The day to target.",
    })
    .option("parts", {
        type: "number",
        alias: ["part", "p"],
        array: true,
        default: [1, 2],
        description: "The part(s) to target.",
    })
    .option("iterations", {
        type: "number",
        alias: ["iter", "i"],
        default: 100,
        description: "How many iterations to run.",
    })
    .parseSync();

console.log(`Solving ${argv.year}/${argv.day} ...`);
console.log();

const input = fs.readFileSync(path.join(getEnvironmentDir(argv.year, argv.day), "input.txt"), "utf-8");

for (const part of argv.parts) {
    const partSolver = await dynamicImportDayScript<PartSolver<unknown>>(argv.year, argv.day, `part${part}.ts`);
    if (partSolver === undefined) {
        console.warn(chalk.yellow`No solver for part ${part} was registered.`);
    } else {
        let total = 0;
        const spinner = ora({ text: `Benchmarking part ${part} ...` }).start();
        for (let i = 0; i < argv.iterations; i++) {
            const [_, duration] = withPerformance(() => partSolver(input));
            total += duration;

            await sleep(1);
        }
        spinner.stop();
        total /= argv.iterations;
        console.log(chalk`Part ${part}: ~${formatDuration(total)}`);
    }
}

console.log();
process.exit(0);
