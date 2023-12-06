import chalk from "chalk";
import { DateTime } from "luxon";
import ora from "ora";
import yargs from "yargs";
import fs from "fs";
import { hideBin } from "yargs/helpers";
import { makeBanner } from "./lib/banner.js";
import { getEnvironmentDir, getRootDir } from "./lib/paths.js";
import { withPerformanceAsync } from "./lib/performance.js";
import { sleep } from "./lib/promise.js";
import path from "path";
import { getLevelInput, getLevelPrompt, hasSessionToken } from "./lib/agent.js";
import { formatDuration } from "./lib/format.js";
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
const envDir = getEnvironmentDir(argv.year, argv.day);

const [_, duration] = await withPerformanceAsync(async () => {
    if (!argv.fetchOnly) {
        console.log(`Scaffolding an environment for ${argv.year}/${argv.day} ...`);
        if (fs.existsSync(getEnvironmentDir(argv.year, argv.day))) {
            console.error(
                chalk.red`Could not scaffold an environment for ${argv.year}/${argv.day} - make sure it does not exist yet.`
            );
            console.log();

            process.exit(1);
        }

        fs.mkdirSync(envDir, { recursive: true });
        // console.log(chalk.gray`Created environment for ${argv.year}/${argv.day}.`)

        const templatePath = path.join(rootDir, "templates/day");
        for (const templateFile of fs.readdirSync(templatePath)) {
            const srcPath = path.join(templatePath, templateFile);
            const dstPath = path.join(envDir, templateFile);
            fs.copyFileSync(srcPath, dstPath);

            console.log(chalk.gray`Created ${path.relative(rootDir, dstPath)}.`);
        }
    }

    if (hasSessionToken()) {
        console.log(`Fetching data ...`);

        const input = await getLevelInput(argv.year, argv.day);
        if (input !== undefined) {
            const dstPath = path.join(envDir, "input.txt");
            fs.writeFileSync(dstPath, input);
            console.log(chalk.gray`Downloaded input to ${path.relative(rootDir, dstPath)}.`);
        } else {
            console.warn(chalk.yellow("Could not fetch the puzzle input."));
        }

        const prompt = await getLevelPrompt(argv.year, argv.day);
        if (prompt !== undefined) {
            const dstPath = path.join(envDir, "readme.md");
            fs.writeFileSync(dstPath, prompt.join("\n\n---\n\n"));
            console.log(chalk.gray`Downloaded prompt to ${path.relative(rootDir, dstPath)}.`);
        } else {
            console.warn(chalk.yellow("Could not fetch the puzzle prompt."));
        }
    } else {
        if (argv.fetchOnly) {
            console.error(chalk.red("Cannot fetch anything if no session token is provided."));
        }
    }

    // fs.rmSync(dayPath, { recursive: true, force: true });
});

console.log(`Puzzle environment scaffolded in ${formatDuration(duration)}. Happy coding!`);
console.log();

process.exit(0);
