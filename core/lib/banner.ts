import chalk from "chalk";

export function makeBanner(): void {
    console.log();
    console.log(chalk.yellowBright`       c`);
    console.log(chalk.green`      >${makeDecoration(1)}<`);
    console.log(chalk.green`     >${makeDecoration(3)}<      ` + chalk.yellow.bold`Advent of Code`);
    console.log(chalk.green`    >${makeDecoration(5)}<     ` + chalk.white(makeQuote()));
    console.log(chalk.green`   >${makeDecoration(7)}<`);
    console.log(chalk.dim.red`     _|_|_`);
    console.log();
}

function makeDecoration(width: number): string {
    if (width <= 0) {
        throw new Error();
    }

    let left = Math.floor(Math.random() * width);

    const possibleDecorations = ["o", "O", "@", "*", "#"];
    const possibleAlternations = [",", "."];
    const possibleDecorationColors = ["cyan", "red", "magenta", "blue"];

    let result = "";
    let wasDeco = false;
    for (let i = 0; i < width; i++) {
        if (wasDeco || Math.random() < 0.5) {
            result += Math.random() < 0.7 ? (i < left ? ">" : "<") : randomFromArray(possibleAlternations);
            wasDeco = false;
        } else {
            const deco = randomFromArray(possibleDecorations);
            const color = deco === "*" ? "yellow" : randomFromArray(possibleDecorationColors);
            result += chalk`{${color} ${deco}}`;
            wasDeco = true;
        }
    }

    return result;
}

const quotes = [
    // TODO: add more quotes
    "Home is where Christmas is!",
    "Season's Greetings!",
    "Comfort and Joy!",
    "Christmas is coming!",
    "Keep calm and jingle all the way!",
    "All I want for Christmas is you!",
    "Walking in a winter wonderland!",
    "'tis the season to be jolly!",
];
function makeQuote(): string {
    return randomFromArray(quotes);
}

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
