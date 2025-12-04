import chalk from "chalk";
import "dotenv/config";
import fs from "fs";
import ora from "ora";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import { formatDuration } from "./lib/format.js";
import { getDayDir } from "./lib/paths.js";
import { readPerformanceTable, writePerformanceTable } from "./lib/performance.js";
import { sleep } from "./lib/promise.js";
import * as runner from "./lib/runner.js";

makeBanner();

const argv = yargs(hideBin(process.argv))
    .option("years", {
        type: "number",
        alias: ["year", "y"],
        array: true,
        default: [new Date().getFullYear()],
        description: "The year(s) to target.",
    })
    .option("days", {
        type: "number",
        alias: ["day", "d"],
        array: true,
        default: [new Date().getDate()],
        description: "The day(s) to target.",
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

await runner.forEachYear(async (year) => {
    const performanceTable = readPerformanceTable(year);

    for (const day of argv.days) {
        console.group(chalk.black`{yellow ${day.toString().padStart(2, "0")}}/12/${year.toString()}`);

        const input = fs.readFileSync(path.join(getDayDir(year, day), "input.txt"), "utf-8");

        for (const part of argv.parts) {
            console.group(chalk.black`Part {yellow ${part}}:`);

            if (!runner.hasSolver(year, day, part)) {
                console.log(chalk.black`< no solver found >`);
            } else {
                const runtimes: number[] = [];
                const spinner = ora({ text: `Benchmarking ...` }).start();
                for (let i = 0; i < argv.iterations; i++) {
                    const [_, duration] = await runner.solve(year, day, part, input);
                    runtimes.push(duration);

                    await sleep(1);
                }
                spinner.stop();

                const mean = runtimes.reduce((acc, cur) => acc + cur, 0) / runtimes.length;
                const stdev = Math.sqrt(runtimes.reduce((acc, cur) => acc + (cur - mean) ** 2) / (runtimes.length - 1));
                console.log(
                    chalk.cyan("μ = " + formatDuration(mean)) +
                        " " +
                        chalk.dim.gray("(σ = " + formatDuration(stdev) + ")")
                );

                performanceTable[day - 1][part - 1] = mean;
            }

            console.groupEnd();
        }

        console.groupEnd();
    }

    writePerformanceTable(year, performanceTable);
}, argv.years);

console.log();
process.exit(0);
