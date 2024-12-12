type Coord = [number, number];

export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split(""));
    const seen = new Set<string>();

    let totalCost = 0;
    for (let ci = 0; ci < grid.length; ci++) {
        for (let cj = 0; cj < grid[ci].length; cj++) {
            if (seen.has(ci + "," + cj)) {
                continue;
            }

            const regionIdentifier = grid[ci][cj];
            let regionArea = 0;
            let regionPerimeter = 0;

            const search: Coord[] = [[ci, cj]];
            while (search.length > 0) {
                const [si, sj] = search.pop()!;
                if (seen.has(si + "," + sj)) {
                    continue;
                }

                const regionalNeighbours = [
                    [0, 1],
                    [1, 0],
                    [0, -1],
                    [-1, 0],
                ]
                    .map(([di, dj]) => [si + di, sj + dj] satisfies Coord)
                    .filter(([i, j]) => i >= 0 && j >= 0 && i < grid.length && j < grid[i].length)
                    .filter(([i, j]) => grid[i][j] === regionIdentifier);

                regionArea++;
                regionPerimeter += 4 - regionalNeighbours.length;

                search.push(...regionalNeighbours);
                seen.add(si + "," + sj);
            }

            totalCost += regionArea * regionPerimeter;
        }
    }

    return totalCost;
}
