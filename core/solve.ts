import chalk from "chalk";
import "dotenv/config";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getLevelPrompt, hasSession, hasSessionToken, submitLevelSolution } from "./lib/agent.js";
import { makeBanner } from "./lib/banner.js";
import { formatDuration } from "./lib/format.js";
import * as logger from "./lib/logger.js";
import { getDayDir, getRootDir } from "./lib/paths.js";
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
    .option("submit", {
        type: "boolean",
        default: false,
        description: "Whether to submit after solving. Requires a session and a single part.",
    })
    .parseSync();

const targetCount = argv.years.length * argv.days.length * argv.parts.length;

let submit = argv.submit;
if (submit && targetCount > 1) {
    console.warn(chalk.yellow("Submitting is disabled when running multiple targets."));
    submit = false;
}
if (submit && !hasSessionToken()) {
    console.warn(chalk.yellow("Submitting is disabled when no session token is provided."));
    submit = false;
}
if (submit && !(await hasSession())) {
    console.warn(chalk.yellow("Submitting is disabled due to an invalid session token."));
    submit = false;
}

await runner.forEachDay(
    async (year, day) => {
        const input = runner.getInput(year, day);
        if (!input) {
            console.error(chalk.red("No input available."));
            return;
        }

        for (const part of argv.parts) {
            logger.group(chalk.gray`Part {yellow ${part}}:`);

            if (!runner.hasSolver(year, day, part)) {
                logger.log(chalk.gray`< no solver found >`);
            } else {
                const [result, duration] = await runner.solve(year, day, part, input);
                logger.log(chalk`{yellow ${result}} {gray (${formatDuration(duration)})}`);

                if (submit) {
                    try {
                        const response = await submitLevelSolution(year, day, part, String(result));
                        switch (response) {
                            case "ok":
                                logger.log(chalk.green("That solution was correct!"));

                                if (part !== 2) {
                                    const prompt = await getLevelPrompt(year, day);
                                    if (prompt !== undefined) {
                                        const dstPath = path.join(getDayDir(year, day), "readme.md");
                                        fs.writeFileSync(dstPath, prompt.join("\n\n---\n\n"));
                                        logger.log(
                                            chalk.gray`Downloaded new prompt to ${path.relative(
                                                getRootDir(),
                                                dstPath
                                            )}.`
                                        );
                                    } else {
                                        console.warn(chalk.yellow("Could not fetch the puzzle new prompt."));
                                    }
                                }
                                break;
                            case "incorrect":
                                console.error(chalk.red("That solution was incorrect."));
                                break;
                            case "too-recent":
                                console.warn(chalk.yellow("You tried to submit too recently!"));
                                break;
                            case "error":
                                throw new Error("Error while submitting.");
                        }
                    } catch (e) {
                        logger.error(chalk.red("An error occurred while submitting."));
                    }
                }
            }

            logger.groupEnd();
        }
    },
    argv.years,
    argv.days
);

console.log();
process.exit(0);
