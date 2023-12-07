import { NodeHtmlMarkdown } from "node-html-markdown";
import NodeHtmlParser from "node-html-parser";
import ora from "ora";

export interface SessionInfo {
    username: string;
}

const URL_TEMPLATES = {
    ROOT: "https://adventofcode.com/",
    INPUT: "https://adventofcode.com/{year}/day/{day}/input",
    LEVEL: "https://adventofcode.com/{year}/day/{day}",
    SUBMIT: "https://adventofcode.com/{year}/day/{day}/answer",
};

export function hasSessionToken(): boolean {
    return getToken() !== undefined;
}

export async function hasSession(): Promise<boolean> {
    return (await getSessionInfo()) !== undefined;
}

export async function getSessionInfo(): Promise<SessionInfo | undefined> {
    if (!hasSessionToken()) {
        return undefined;
    }

    const spinner = createSpinner("Fetching session ...").start();

    const html = await fetch(URL_TEMPLATES.ROOT, {
        headers: getHeaders(),
    }).then((res) => res.text());

    const document = NodeHtmlParser.parse(html);
    const userNode = document.querySelector("nav + .user");
    if (!userNode) {
        return undefined;
    }

    spinner.stop();

    const username = userNode.innerText.match(/(.+) \d+\*/)?.[1] ?? "<anonymous>";

    return {
        username,
    };
}

export async function getLevelInput(year: number, day: number): Promise<string | undefined> {
    if (!hasSessionToken()) {
        return undefined;
    }

    const spinner = createSpinner("Fetching input ...").start();
    let result: string | undefined = undefined;

    try {
        const response = await fetch(
            URL_TEMPLATES.INPUT.replace("{year}", year.toString()).replace("{day}", day.toString()),
            {
                headers: getHeaders(),
            }
        );
        const text = await response.text();
        result = text.trimEnd();
    } catch (e) {
        console.error("Something went wrong. " + e);
    }

    spinner.stop();

    return result;
}

export async function getLevelPrompt(year: number, day: number): Promise<string[] | undefined> {
    if (!hasSessionToken()) {
        return undefined;
    }

    const spinner = createSpinner("Fetching prompt ...").start();
    let result: string[] | undefined = undefined;

    try {
        const response = await fetch(
            URL_TEMPLATES.LEVEL.replace("{year}", year.toString()).replace("{day}", day.toString()),
            {
                headers: getHeaders(),
            }
        );
        const html = await response.text();
        const document = NodeHtmlParser.parse(html);
        const levels = document.querySelectorAll("article.day-desc");
        result = levels.map((level) => NodeHtmlMarkdown.translate(level.innerHTML, {}, undefined, undefined));
    } catch (e) {
        console.error("Something went wrong. " + e);
    }

    spinner.stop();

    return result;
}

export async function submitLevelSolution(
    year: number,
    day: number,
    part: number,
    result: string
): Promise<"ok" | "incorrect" | "too-recent" | "error"> {
    const spinner = createSpinner("Submitting solution ...").start();

    const response = await fetch(
        URL_TEMPLATES.SUBMIT.replace("{year}", year.toString()).replace("{day}", day.toString()),
        {
            method: "POST",
            body: new URLSearchParams({
                level: part.toString(),
                answer: result,
            }),
            headers: {
                ...getHeaders(),
                Referer: URL_TEMPLATES.LEVEL.replace("{year}", year.toString()).replace("{day}", day.toString()),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    spinner.stop();

    if (!response.ok) {
        return "error";
    }

    const text = await response.text();
    if (text.includes("That's not the right answer")) {
        return "incorrect";
    }
    if (text.includes("You gave an answer too recently")) {
        return "too-recent";
    }
    return "ok";
}

function getToken(): string | undefined {
    return process.env.AOC_SESSION_TOKEN;
}

function getHeaders(): Record<string, string> {
    return {
        Cookie: `session=${getToken()}`,
        "User-Agent": "github.com/yiliansource/advent-of-code by yiliansource (at) gmail.com",
    };
}

function createSpinner(text: string): ReturnType<typeof ora> {
    return ora({
        spinner: "line",
        text,
    });
}
