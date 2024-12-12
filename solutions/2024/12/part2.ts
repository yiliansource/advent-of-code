import { boolean, number } from "yargs";

type Coord = [number, number];

export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split(""));
    const seen = new Set<string>();

    const isCoordInBounds = ([i, j]: Coord): boolean => i >= 0 && j >= 0 && i < grid.length && j < grid[i].length;

    let totalCost = 0;
    for (let ci = 0; ci < grid.length; ci++) {
        for (let cj = 0; cj < grid[ci].length; cj++) {
            if (seen.has(ci + "," + cj)) {
                continue;
            }

            const regionIdentifier = grid[ci][cj];
            const regionPoints: Coord[] = [];

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
                    .filter(isCoordInBounds)
                    .filter(([i, j]) => grid[i][j] === regionIdentifier);

                regionPoints.push([si, sj]);

                search.push(...regionalNeighbours);
                seen.add(si + "," + sj);
            }

            const [imin, imax, jmin, jmax] = regionPoints.reduce(
                ([imin, imax, jmin, jmax], [i, j]) => [
                    Math.min(i, imin),
                    Math.max(i, imax),
                    Math.min(j, jmin),
                    Math.max(j, jmax),
                ],
                [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
            );

            const regionPointIds = new Set(regionPoints.map(([i, j]) => i + "," + j));
            const regionHasCoord = ([i, j]: Coord) => regionPointIds.has(i + "," + j);

            let edges = 0;

            for (let j = jmin; j <= jmax; j++) {
                let wasLeftEdge = false;
                let wasRightEdge = false;

                for (let i = imin; i <= imax; i++) {
                    const hasLeftEdge = regionHasCoord([i, j]) && !regionHasCoord([i, j - 1]);
                    const hasRightEdge = regionHasCoord([i, j]) && !regionHasCoord([i, j + 1]);

                    if (!wasLeftEdge && hasLeftEdge) edges++;
                    wasLeftEdge = hasLeftEdge;

                    if (!wasRightEdge && hasRightEdge) edges++;
                    wasRightEdge = hasRightEdge;
                }
            }

            for (let i = imin; i <= imax; i++) {
                let wasTopEdge = false;
                let wasBottomEdge = false;

                for (let j = jmin; j <= jmax; j++) {
                    const hasTopEdge = regionHasCoord([i, j]) && !regionHasCoord([i - 1, j]);
                    const hasBottomEdge = regionHasCoord([i, j]) && !regionHasCoord([i + 1, j]);

                    if (!wasTopEdge && hasTopEdge) edges++;
                    wasTopEdge = hasTopEdge;

                    if (!wasBottomEdge && hasBottomEdge) edges++;
                    wasBottomEdge = hasBottomEdge;
                }
            }

            totalCost += regionPoints.length * edges;
        }
    }

    return totalCost;
}
