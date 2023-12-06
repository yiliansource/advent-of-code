export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => {
            let matches = Array.from(line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g)).map(
                (m) => m[1]
            );
            if (!matches) {
                throw new Error("no match found in line.");
            }

            return wordDigitToDigit(matches[0]) + wordDigitToDigit(matches[matches.length - 1]);
        })
        .map(Number)
        .reduce((acc, cur) => acc + cur, 0);
}

function wordDigitToDigit(word: string): string {
    if (/\d/.test(word)) {
        return word;
    }
    return String(charLookup[word]);
}

const charLookup: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};
