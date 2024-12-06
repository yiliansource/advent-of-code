export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split(""));

    let di = -1,
        dj = 0;
    const oi = grid.findIndex((l) => l.includes("^")),
        oj = grid[oi].indexOf("^");
    let ci = oi,
        cj = oj;

    grid[oi][oj] = ".";

    const isObstacle = (i: number, j: number) => grid[i]?.[j] === "#";
    const isOutOfBounds = (i: number, j: number) => grid[i]?.[j] == undefined;

    const potentialObstacles: [number, number][] = [];
    let validObstacles = 0;

    while (true) {
        while (!isObstacle(ci + di, cj + dj) && !isOutOfBounds(ci, cj)) {
            potentialObstacles.push([ci, cj]);

            ci += di;
            cj += dj;
        }

        if (isOutOfBounds(ci, cj)) {
            break;
        }

        [di, dj] = [dj, -di];
    }

    for (let k = 0; k < potentialObstacles.length; k++) {
        const [pi, pj] = potentialObstacles[k];
        if (pi === oi && pj === oj) continue;
        if (potentialObstacles.findIndex(([spi, spj]) => spi === pi && spj === pj) < k) continue;

        grid[pi][pj] = "#";

        [ci, cj] = potentialObstacles[k - 1];
        [di, dj] = [pi - ci, pj - cj];

        const seen = new Set<string>();

        traverse: while (true) {
            while (!isObstacle(ci + di, cj + dj) && !isOutOfBounds(ci, cj)) {
                seen.add([ci, cj, di, dj].join(","));

                ci += di;
                cj += dj;

                if (seen.has([ci, cj, di, dj].join(","))) {
                    validObstacles++;
                    break traverse;
                }
            }

            if (isOutOfBounds(ci, cj)) {
                break;
            }

            [di, dj] = [dj, -di];

            // this handles the edge case that we only turn, without moving.

            if (seen.has([ci, cj, di, dj].join(","))) {
                validObstacles++;
                break traverse;
            }

            seen.add([ci, cj, di, dj].join(","));
        }

        grid[pi][pj] = ".";
    }

    return validObstacles;
}
