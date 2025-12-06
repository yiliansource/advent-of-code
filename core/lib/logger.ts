import chalk from "chalk";

export function log(message?: string) {
    console.log(typeof message === "undefined" ? "" : message);
}

export function group(message: string) {
    console.group("▶ " + message);
}

export function groupEnd() {
    console.groupEnd();
}

export function success(message: string) {
    console.log(chalk.green("✓") + " " + message);
}

export function error(message: string) {
    console.error(chalk.red("x") + " " + message);
}
