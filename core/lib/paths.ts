import path from "path";
import { fileURLToPath } from "url";

export function getRootDir(): string {
    return path.join(fileURLToPath(import.meta.url), "../../..");
}

export function getEnvironmentDir(year: number, day: number): string {
    return path.join(getRootDir(), `solutions/${year}/${day.toString().padStart(2, "0")}`);
}

export async function dynamicImportDayScript<T>(year: number, day: number, name: string): Promise<T | undefined> {
    return (await import("file://" + path.join(getEnvironmentDir(year, day), name))).default as T;
}
