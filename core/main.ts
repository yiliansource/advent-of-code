import chalk from "chalk";
import yargs from "yargs";
import { makeBanner } from "./banner.js";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs";
import { getInput, getLevelContent, hasSession } from "./agent.js";
import { fileURLToPath } from "url";
import { formatDuration } from "./format.js";
import { withPerformance, withPerformanceAsync } from "./performance.js";
import "dotenv/config";
import { InputParser, PartSolver } from "./types.js";

makeBanner();

const argv = yargs(hideBin(process.argv))
    .option("year", {
        type: "number",
        default: new Date().getFullYear(),
    })
    .option("day", {
        type: "number",
        default: new Date().getDate(),
    })
    .option("parts", {
        type: "number",
        array: true,
        default: [1, 2],
    })
    .option("scaffold", {
        type: "boolean",
    })
    .option("test", {
        type: "boolean",
    })
    .option("session", {
        type: "boolean",
    })
    .parseSync();

const rootDir = path.join(fileURLToPath(import.meta.url), "../..");
const dayPath = path.join(rootDir, `solutions/${argv.year}/${argv.day.toString().padStart(2, "0")}`);

if (argv.session) {
    throw new Error("Not implemented.");
}

if (argv.scaffold) {
    const [_, duration] = await withPerformanceAsync(async () => {
        console.log(`Scaffolding an environment for ${argv.year}/${argv.day} ...`);

        if (fs.existsSync(dayPath)) {
            console.error(
                chalk.red(
                    `Could not scaffold an environment for ${argv.year}/${argv.day} - make sure it does not exist yet.`
                )
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

        if (hasSession()) {
            const input = await getInput(argv.year, argv.day);
            if (input !== undefined) {
                const dstPath = path.join(dayPath, "input.txt");
                fs.writeFileSync(dstPath, input);
                console.log(chalk.gray`Downloaded input to ${path.relative(rootDir, dstPath)}.`);
            } else {
                console.warn(chalk.yellow("Could not automatically fetch the puzzle input."));
            }

            const info = await getLevelContent(argv.year, argv.day);
            if (info !== undefined) {
                const dstPath = path.join(dayPath, "readme.md");
                fs.writeFileSync(dstPath, info.join("\n\n---\n\n"));
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
    }
}

console.log();
process.exit(0);
