import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import { dynamicImportDayScript } from "./lib/paths.js";
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
    .parseSync();

console.log(`Testing ${argv.year}/${argv.day} ...`);
console.log();

const stats = {
    passed: 0,
    failed: 0,
    skipped: 0,
};

for (const part of argv.parts) {
    const tester = await dynamicImportDayScript<() => void>(argv.year, argv.day, `part${part}.spec.ts`);
    if (tester) {
        console.group(`Part ${part}:`);
        try {
            tester();

            console.log(chalk`{green ✓} All assertions passed.`);
            stats.passed++;
        } catch (e) {
            if (e instanceof Error) {
                console.error(chalk`{red ✗} ${e.message}`);
            }
            stats.failed++;
        }
        console.groupEnd();
    } else {
        stats.skipped++;
    }
}

console.log(chalk.gray`(${stats.passed} passed, ${stats.failed} failed, ${stats.skipped} skipped)`);

console.log();
process.exit(stats.failed > 0 ? 1 : 0);
