export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split("").map(Number));

    let score = 0;

    for (let oi = 0; oi < grid.length; oi++) {
        for (let oj = 0; oj < grid[oi].length; oj++) {
            if (grid[oi][oj] === 0) {
                const ponder: [number, number][] = [[oi, oj]];
                const found = new Set<string>();

                while (ponder.length > 0) {
                    const [i, j] = ponder.pop()!;
                    const v = grid[i][j];
                    if (v === 9 && !found.has([i, j].join(","))) {
                        score++;
                        found.add([i, j].join(","));
                    } else {
                        const candidates: [number, number][] = [
                            [i + 1, j],
                            [i, j - 1],
                            [i - 1, j],
                            [i, j + 1],
                        ];

                        for (const [ci, cj] of candidates) {
                            if (ci >= 0 && cj >= 0 && ci < grid.length && cj < grid[ci].length) {
                                if (grid[ci][cj] === v + 1) {
                                    ponder.push([ci, cj]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return score;
}
