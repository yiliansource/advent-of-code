import chalk from "chalk";
import { getSessionInfo, hasSession, hasSessionToken } from "./lib/agent.js";
import { makeBanner } from "./lib/banner.js";
import "dotenv/config";
import * as logger from "./lib/logger.js";

makeBanner();

logger.group("Checking for a session ...");

if (!hasSessionToken()) {
    logger.error("No session token specified.");
    logger.log();
    logger.groupEnd();

    process.exit(1);
}

if (!(await hasSession())) {
    logger.error("No session active - your access token may be wrong or expired.");
    logger.log();
    logger.groupEnd();

    process.exit(1);
}

const info = (await getSessionInfo())!;
logger.success(chalk`Session currently active as {yellow ${info.username}}.`);
logger.log();
logger.groupEnd();

process.exit(0);
