export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split(""));

    let di = -1,
        dj = 0;
    let ci = grid.findIndex((l) => l.includes("^")),
        cj = grid[ci].indexOf("^");

    const isObstacle = (i: number, j: number) => grid[i]?.[j] === "#";
    const isOutOfBounds = (i: number, j: number) => grid[i]?.[j] == undefined;

    while (true) {
        while (!isObstacle(ci + di, cj + dj) && !isOutOfBounds(ci, cj)) {
            grid[ci][cj] = "X";

            ci += di;
            cj += dj;
        }

        if (isOutOfBounds(ci, cj)) {
            break;
        }

        [di, dj] = [dj, -di];
    }

    return grid.map((l) => l.filter((c) => c === "X").length).reduce((acc, cur) => acc + cur, 0);
}
