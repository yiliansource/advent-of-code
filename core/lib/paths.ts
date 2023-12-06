import path from "path";
import { fileURLToPath } from "url";

export function getRootDir(): string {
    return path.join(fileURLToPath(import.meta.url), "../../..");
}

export function getYearDir(year: number): string {
    return path.join(getRootDir(), `solutions/${year.toString()}`);
}

export function getDayDir(year: number, day: number): string {
    return path.join(getYearDir(year), `${day.toString().padStart(2, "0")}`);
}
