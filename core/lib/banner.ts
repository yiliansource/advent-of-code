import chalk from "chalk";

export function makeBanner(): void {
    // TODO: scramble christmas tree to be random every time.
    console.log();
    console.log(chalk.whiteBright`       c`);
    console.log(chalk.green`      >{cyan o}<`);
    console.log(chalk.green`     >,>{red O}<      ` + chalk.yellow.bold`* Advent of Code *`);
    console.log(chalk.green`    >{yellow *}>.>{blue @}<     ` + chalk.gray(makeQuote()));
    console.log(chalk.green`   >{red @}.>{magenta o},<{yellow *}<`);
    console.log(chalk.gray`     _|_|_`);
    console.log();
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
    return quotes[Math.floor(Math.random() * quotes.length)];
}
