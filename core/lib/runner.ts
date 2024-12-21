import chalk from "chalk";
import fs from "fs";
import path from "path";
import { getDayDir } from "./paths.js";
import { withPerformance } from "./performance.js";

export type ScriptType = "solver" | "tester";

export type PartSolverModule<T> = {
    default: PartSolver<T>;
};
export type PartTestingModule = Record<string, () => void>;

export type PartTestResult = {
    methodName: string;
    error?: unknown;
};
export type PartSolver<T> = (input: string) => T;

export async function forEachYear(action: (year: number) => Promise<void>, years: number[]): Promise<void> {
    for (const year of years) {
        console.group(chalk.black`Advent of Code {yellow ${year}}`);
        await action(year);
        console.groupEnd();
    }
}

export async function forEachDay(
    action: (year: number, day: number) => Promise<void>,
    years: number[],
    days: number[]
): Promise<void> {
    await forEachYear(async (year) => {
        for (const day of days) {
            console.group(chalk.black`{yellow ${day.toString().padStart(2, "0")}}/12/${year.toString()}`);
            await action(year, day);
            console.groupEnd();
        }
    }, years);
}

export async function forEachPart(
    action: (year: number, day: number, part: number) => Promise<void>,
    years: number[],
    days: number[],
    parts: number[]
): Promise<void> {
    await forEachDay(
        async (year, day) => {
            for (const part of parts) {
                console.group(chalk.black`Part {yellow ${part}}`);
                await action(year, day, part);
                console.groupEnd();
            }
        },
        years,
        days
    );
}

export function getInput(year: number, day: number): string | null {
    const inputFile = path.join(getDayDir(year, day), "input.txt");
    if (!fs.existsSync(inputFile)) return null;
    return fs.readFileSync(inputFile, "utf-8");
}

export function hasSolver(year: number, day: number, part: number): boolean {
    return hasScript(year, day, part, "solver");
}

export async function solve(year: number, day: number, part: number, input: string): Promise<[unknown, number]> {
    const partSolverModule = await dynamicImportScript<PartSolverModule<unknown>>(year, day, part, "solver");
    if (!partSolverModule) throw new Error("No solver found.");
    return withPerformance(() => partSolverModule.default(input));
}

export async function hasTester(year: number, day: number, part: number) {
    return hasScript(year, day, part, "tester");
}

export async function* test(year: number, day: number, part: number) {
    const partTestingModule = await dynamicImportScript<PartTestingModule>(year, day, part, "tester");
    if (!partTestingModule) throw new Error("No tester found.");
    for (const partTesterName in partTestingModule) {
        const result: PartTestResult = {
            methodName: partTesterName,
        };
        try {
            partTestingModule[partTesterName]();
        } catch (e) {
            result.error = e;
        }
        yield result;
    }
}

function hasScript(year: number, day: number, part: number, type: ScriptType): boolean {
    return fs.existsSync(getScriptPath(year, day, part, type));
}

function getScriptPath(year: number, day: number, part: number, type: ScriptType): string {
    let name = "";
    switch (type) {
        case "solver":
            name = `part${part}.ts`;
            break;
        case "tester":
            name = `part${part}.spec.ts`;
            break;
        default:
            throw new Error("Invalid script type.");
    }
    return path.join(getDayDir(year, day), name);
}

async function dynamicImportScript<T>(
    year: number,
    day: number,
    part: number,
    type: ScriptType
): Promise<T | undefined> {
    return (await import("file://" + getScriptPath(year, day, part, type))) as T;
}
