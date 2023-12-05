import fs from "fs";
import path from "path";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getLevelPrompt, hasSession, hasSessionToken, submitLevelSolution } from "./lib/agent.js";
import { makeBanner } from "./lib/banner.js";
import { dynamicImportDayScript, getEnvironmentDir, getRootDir } from "./lib/paths.js";
import { PartSolver } from "./lib/types.js";
import { withPerformance } from "./lib/performance.js";
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

let submit = argv.submit;
if (submit && argv.parts.length > 1) {
    console.warn(chalk.yellow("Submitting is disabled when running multiple parts."));
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

console.log(`Solving ${argv.year}/${argv.day} ...`);
console.log();

const input = fs.readFileSync(path.join(getEnvironmentDir(argv.year, argv.day), "input.txt"), "utf-8");

for (const part of argv.parts) {
    const partSolver = await dynamicImportDayScript<PartSolver<unknown>>(argv.year, argv.day, `part${part}.ts`);
    if (partSolver === undefined) {
        console.warn(chalk.yellow`No solver for part ${part} was registered.`);
    } else {
        const [result, duration] = withPerformance(() => partSolver(input));
        console.log(chalk`Part ${part}: {yellow ${result}} {gray (${formatDuration(duration)})}`);

        // TODO: add to chart in readme

        if (submit) {
            try {
                // TODO: this does not work propery for some reason
                // it does validate the answer but it doesnt mark the part as solved.
                const response = await submitLevelSolution(argv.year, argv.day, part, String(result));
                switch (response) {
                    case "ok":
                        console.log(chalk.green("That solution was correct!"));

                        const prompt = await getLevelPrompt(argv.year, argv.day);
                        if (prompt !== undefined) {
                            const dstPath = path.join(getEnvironmentDir(argv.year, argv.day), "readme.md");
                            fs.writeFileSync(dstPath, prompt.join("\n\n---\n\n"));
                            console.log(chalk.gray`Downloaded new prompt to ${path.relative(getRootDir(), dstPath)}.`);
                        } else {
                            console.warn(chalk.yellow("Could not fetch the puzzle new prompt."));
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
                console.error(chalk.red("An error occurred while submitting."));
            }
        }
    }
}

console.log();
process.exit(0);
