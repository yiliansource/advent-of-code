export default function (input: ReturnType<typeof import("./parser.js").default>): number {
    return input
        .map((line) => {
            let matches = line.match(/\d/g);
            if (!matches) {
                throw new Error("no match found in line.");
            }

            return matches[0] + matches[matches.length - 1];
        })
        .map(Number)
        .reduce((acc, cur) => acc + cur, 0);
}
