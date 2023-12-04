export default function (input: ReturnType<typeof import("./parser.js").default>): number {
    return input
        .map(([winning, mine]) => {
            let count = 0;
            const map: Record<number, boolean> = {};
            for (const a of winning) {
                map[a] = true;
            }
            for (const b of mine) {
                if (b in map) {
                    if (count === 0) count = 1;
                    else count *= 2;
                }
            }

            return count;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
