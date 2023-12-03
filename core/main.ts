import chalk from "chalk";
import yargs from "yargs";
import { makeBanner } from "./banner.js";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs";
import {
    getLevelInput,
    getLevelPrompt,
    getSessionInfo,
    hasSession,
    hasSessionToken,
    submitLevelSolution,
} from "./agent.js";
import { fileURLToPath } from "url";
import { formatDuration } from "./format.js";
import { withPerformance, withPerformanceAsync } from "./performance.js";
import "dotenv/config";
import { InputParser, PartSolver } from "./types.js";
import { DateTime } from "luxon";
import ora from "ora";
import { sleep } from "./promise.js";

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
    .option("scaffold", {
        type: "boolean",
        description: "Scaffolds an environment for targeted day.",
    })
    .option("test", {
        type: "boolean",
        description: "Whether to run the unit tests for the targeted day.",
    })
    .option("submit", {
        type: "boolean",
        description: "Whether to submit the result after solving. Requires a session and a single part.",
    })
    .option("session", {
        type: "boolean",
        description: "Verifies the current session token.",
    })
    .parseSync();

const rootDir = path.join(fileURLToPath(import.meta.url), "../..");
const dayPath = path.join(rootDir, `solutions/${argv.year}/${argv.day.toString().padStart(2, "0")}`);

if (argv.session) {
    console.log(chalk`Checking for a session ...`);

    if (!hasSessionToken()) {
        console.error(chalk.red`No session token specified.`);
        console.log();

        process.exit(1);
    }

    if (!(await hasSession())) {
        console.error(chalk.red`No session active - your access token may be wrong or expired.`);
        console.log();

        process.exit(1);
    }

    const info = (await getSessionInfo())!;
    console.log(chalk`Session currently active as {yellow ${info.username}}.`);
    console.log();

    process.exit(0);
}

if (argv.scaffold) {
    const threshold = DateTime.fromObject({
        year: argv.year,
        month: 12,
        day: argv.day,
        hour: 6,
    });
    if (DateTime.utc() < threshold) {
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

    const [_, duration] = await withPerformanceAsync(async () => {
        console.log(`Scaffolding an environment for ${argv.year}/${argv.day} ...`);

        if (fs.existsSync(dayPath)) {
            console.error(
                chalk.red`Could not scaffold an environment for ${argv.year}/${argv.day} - make sure it does not exist yet.`
            );
            console.log();

            process.exit(1);
        }

        fs.mkdirSync(dayPath, { recursive: true });
        // console.log(chalk.gray`Created environment for ${argv.year}/${argv.day}.`)

        const templatePath = path.join(rootDir, "templates/day");
        for (const templateFile of fs.readdirSync(templatePath)) {
            const srcPath = path.join(templatePath, templateFile);
            const dstPath = path.join(dayPath, templateFile);
            fs.copyFileSync(srcPath, dstPath);

            console.log(chalk.gray`Created ${path.relative(rootDir, dstPath)}.`);
        }

        if (hasSessionToken()) {
            const input = await getLevelInput(argv.year, argv.day);
            if (input !== undefined) {
                const dstPath = path.join(dayPath, "input.txt");
                fs.writeFileSync(dstPath, input);
                console.log(chalk.gray`Downloaded input to ${path.relative(rootDir, dstPath)}.`);
            } else {
                console.warn(chalk.yellow("Could not automatically fetch the puzzle input."));
            }

            const prompt = await getLevelPrompt(argv.year, argv.day);
            if (prompt !== undefined) {
                const dstPath = path.join(dayPath, "readme.md");
                fs.writeFileSync(dstPath, prompt.join("\n\n---\n\n"));
                console.log(chalk.gray`Downloaded prompt to ${path.relative(rootDir, dstPath)}.`);
            } else {
                console.warn(chalk.yellow("Could not automatically fetch the puzzle description."));
            }
        }

        // fs.rmSync(dayPath, { recursive: true, force: true });
    });

    console.log(`Puzzle environment scaffolded in ${formatDuration(duration)}s. Happy coding!`);
    console.log();

    process.exit(0);
}

async function dynamicImportDayScript<T>(name: string): Promise<T | undefined> {
    return (await import("file://" + path.join(dayPath, name))).default as T;
}

if (argv.test) {
    console.log(`Testing ${argv.year}/${argv.day} ...`);
    console.log();

    const stats = {
        passed: 0,
        failed: 0,
        skipped: 0,
    };

    for (const part of argv.parts) {
        const tester = await dynamicImportDayScript<() => void>(`part${part}.spec.ts`);
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
}

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

const parseInput = await dynamicImportDayScript<InputParser<unknown>>("parser.ts");
const rawInput = fs.readFileSync(path.join(dayPath, "input.txt"), "utf-8");
const parsedInput = parseInput?.(rawInput) ?? rawInput;

for (const part of argv.parts) {
    const partSolver = await dynamicImportDayScript<PartSolver<unknown, unknown>>(`part${part}.ts`);
    if (partSolver === undefined) {
        console.warn(chalk.yellow`No solver for part ${part} was registered.`);
    } else {
        const [result, duration] = withPerformance(() => partSolver(parsedInput));
        console.log(chalk`Part ${part}: {yellow ${result}} {gray (${formatDuration(duration)})}`);

        if (submit) {
            try {
                const response = await submitLevelSolution(argv.year, argv.day, part, String(result));
                switch (response) {
                    case "ok":
                        console.log(chalk.green("That solution was correct!"));
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
