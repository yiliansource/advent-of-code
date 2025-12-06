import chalk from "chalk";
import { DateTime } from "luxon";
import ora from "ora";
import yargs from "yargs";
import fs from "fs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import { getDayDir, getRootDir } from "./lib/paths.js";
import { withPerformanceAsync } from "./lib/performance.js";
import { sleep } from "./lib/promise.js";
import path from "path";
import { getLevelInput, getLevelPrompt, hasSessionToken } from "./lib/agent.js";
import { formatDuration } from "./lib/format.js";
import "dotenv/config";
import * as logger from "./lib/logger.js";

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
    .option("fetch-only", {
        type: "boolean",
        default: false,
        description: "Whether to only fetch the input and prompt.",
    })
    .option("skip-wait", {
        type: "boolean",
        default: false,
        description: "Whether to skip the cooldown until the level unlocks.",
    })
    .parseSync();

const threshold = DateTime.fromObject({
    year: argv.year,
    month: 12,
    day: argv.day,
    hour: 6,
});
if (!argv.skipWait && DateTime.utc() < threshold) {
    const spinner = ora({ text: `Waiting for level to unlock!`, spinner: "star2", color: "yellow" }).start();
    while (DateTime.now() < threshold) {
        const diff = threshold.diff(DateTime.now(), ["hours", "minutes", "seconds"]).toObject();
        spinner.text =
            "Waiting for level to unlock! " +
            chalk`{gray (${diff.hours} hours, ${diff.minutes} minutes, ${Math.floor(diff.seconds ?? 0)} seconds)}`;
        await sleep(1000);
    }
    spinner.stop();
}

const rootDir = getRootDir();
const envDir = getDayDir(argv.year, argv.day);

const [_, duration] = await withPerformanceAsync(async () => {
    if (!argv.fetchOnly) {
        logger.group(`Scaffolding an environment for ${argv.year}/${argv.day} ...`);
        if (fs.existsSync(getDayDir(argv.year, argv.day))) {
            logger.error(
                `Could not scaffold an environment for ${argv.year}/${argv.day} - make sure it does not exist yet.`
            );
            logger.log();
            logger.groupEnd();

            process.exit(1);
        }

        fs.mkdirSync(envDir, { recursive: true });

        const templatePath = path.join(rootDir, "templates/day");
        for (const templateFile of fs.readdirSync(templatePath)) {
            const srcPath = path.join(templatePath, templateFile);
            const dstPath = path.join(envDir, templateFile);
            fs.copyFileSync(srcPath, dstPath);

            logger.success(chalk.gray`Created ${path.relative(rootDir, dstPath)}.`);
        }

        logger.log();
        logger.groupEnd();
    }

    if (hasSessionToken()) {
        logger.group(`Fetching data ...`);

        const input = await getLevelInput(argv.year, argv.day);
        if (input !== undefined) {
            const dstPath = path.join(envDir, "input.txt");
            fs.writeFileSync(dstPath, input);
            logger.success(chalk.gray`Downloaded input to ${path.relative(rootDir, dstPath)}.`);
        } else {
            logger.error("Could not fetch the puzzle input.");
        }

        const prompt = await getLevelPrompt(argv.year, argv.day);
        if (prompt !== undefined) {
            const dstPath = path.join(envDir, "readme.md");
            fs.writeFileSync(dstPath, prompt.join("\n\n---\n\n"));
            logger.success(chalk.gray`Downloaded prompt to ${path.relative(rootDir, dstPath)}.`);
        } else {
            logger.error("Could not fetch the puzzle prompt.");
        }
    } else {
        if (argv.fetchOnly) {
            logger.error(chalk.red("Cannot fetch anything if no session token is provided."));
        }
    }

    logger.log();
    logger.groupEnd();
});

logger.success(`Puzzle environment scaffolded in ${formatDuration(duration)}. Happy coding!`);
logger.log();

process.exit(0);
