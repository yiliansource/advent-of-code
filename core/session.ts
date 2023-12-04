import chalk from "chalk";
import { getSessionInfo, hasSession, hasSessionToken } from "./lib/agent.js";
import { makeBanner } from "./lib/banner.js";
import "dotenv/config";

makeBanner();

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
