export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => {
            return line
                .split(/: +/)[1]
                .split(/ +\| +/)
                .map((parts) => parts.split(/ +/).map(Number));
        })
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
