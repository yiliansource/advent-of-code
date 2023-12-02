import { NodeHtmlMarkdown } from "node-html-markdown";
import NodeHtmlParser from "node-html-parser";

const URL_TEMPLATES = {
    INPUT: "https://adventofcode.com/{year}/day/{day}/input",
    LEVEL: "https://adventofcode.com/{year}/day/{day}",
    SUBMIT: "https://adventofcode.com/{year}/day/{day}/answer",
};

export function hasSession(): boolean {
    return getToken() !== undefined;
}

export async function getInput(year: number, day: number): Promise<string | undefined> {
    if (!hasSession()) {
        return undefined;
    }

    try {
        const text = await fetch(
            URL_TEMPLATES.INPUT.replace("{year}", year.toString()).replace("{day}", day.toString()),
            {
                headers: getHeaders(),
            }
        ).then((res) => res.text());
        return text.trimEnd();
    } catch (e) {
        console.error("Something went wrong. " + e);
        return undefined;
    }
}

export async function getLevelContent(year: number, day: number): Promise<string[] | undefined> {
    if (!hasSession()) {
        return undefined;
    }

    try {
        const html = await fetch(
            URL_TEMPLATES.LEVEL.replace("{year}", year.toString()).replace("{day}", day.toString()),
            {
                headers: getHeaders(),
            }
        ).then((res) => res.text());

        const document = NodeHtmlParser.parse(html);
        const levels = document.querySelectorAll("article.day-desc");
        return levels.map((level) => NodeHtmlMarkdown.translate(level.innerHTML, {}, undefined, undefined));
    } catch (e) {
        console.error("Something went wrong. " + e);
        return undefined;
    }
}

export async function submitLevelSolution(year: number, day: number, part: number): Promise<boolean> {
    return false;
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
