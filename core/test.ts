import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import "dotenv/config";
import * as logger from "./lib/logger.js";
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
    .parseSync();

const stats = {
    passed: 0,
    failed: 0,
    skipped: 0,
};

await runner.forEachPart(
    async (year, day, part) => {
        if (!runner.hasTester(year, day, part)) {
            logger.log(chalk.black`< no tester found >`);
            stats.skipped++;
        } else {
            for await (const result of runner.test(year, day, part)) {
                if (!result.error) {
                    logger.success(result.methodName);
                    stats.passed++;
                }
                if (!!result.error && result.error instanceof Error) {
                    console.group(chalk`{red ✗} ${result.methodName}`);
                    logger.error(result.error.message);
                    console.groupEnd();
                    stats.failed++;
                }
            }
        }
    },
    argv.years,
    argv.days,
    argv.parts
);

logger.log();
logger.log(chalk.black`(${stats.passed} passed, ${stats.failed} failed, ${stats.skipped} skipped)`);

logger.log();
process.exit(stats.failed > 0 ? 1 : 0);
