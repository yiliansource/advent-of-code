import fs from "fs";
import path from "path";
import { formatDuration, parseDuration } from "./format.js";
import { getYearDir } from "./paths.js";

export function withPerformance<T>(fun: () => T): PerformanceResult<T> {
    const start = performance.now();
    const res = fun();
    const end = performance.now();

    const delta = end - start;
    return [res, delta];
}

export async function withPerformanceAsync<T>(fun: () => Promise<T>): Promise<PerformanceResult<T>> {
    const start = performance.now();
    const res = await fun();
    const end = performance.now();

    const delta = end - start;
    return [res, delta];
}

export type PerformanceResult<T> = [T, number];
export type PerformanceTable = [number | null, number | null][];

const tableBeginMarker = "<!-- begin performance table -->";
const tableEndMarker = "<!-- end performance table -->";

export function readPerformanceTable(year: number): PerformanceTable {
    if (!fs.existsSync(getPerformanceTablePath(year))) {
        return Array.from(Array(24).keys()).map(() => [null, null]);
    }

    const tableFileText = fs.readFileSync(getPerformanceTablePath(year), "utf8");

    const tableText = tableFileText.substring(
        tableFileText.indexOf(tableBeginMarker) + tableBeginMarker.length + 1,
        tableFileText.indexOf(tableEndMarker) - 1
    );
    return tableText
        .split("\n")
        .slice(2)
        .map((line, i) => {
            return line
                .split(/ *\| */g)
                .map((c) => (c ? parseDuration(c) : 0))
                .slice(2) as [number, number];
        });
}
export function writePerformanceTable(year: number, table: PerformanceTable): void {
    let tableText = tableBeginMarker + "\n";
    tableText += "| Day | Part 1 | Part 2 |\n| -: | - | - |\n";
    for (let i = 0; i < 24; i++) {
        const entry = table[i];
        if (!!entry) {
            tableText +=
                `| **${i + 1}** |` +
                ` ${entry[0] ? "`" + formatDuration(entry[0]) + "`" : ""} |` +
                ` ${entry[1] ? "`" + formatDuration(entry[1]) + "`" : ""} |\n`;
        } else {
            tableText += `| | |\n`;
        }
    }
    tableText += tableEndMarker + "\n";

    const tableFileText = `# Advent Of Code ${year}

${tableText}`;

    fs.writeFileSync(getPerformanceTablePath(year), tableFileText);
}

function getPerformanceTablePath(year: number): string {
    return path.join(getYearDir(year), "readme.md");
}
