export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(""))
        .reduce(
            (totalAcc, row, i, matrix) =>
                totalAcc +
                row.reduce(
                    (rowAcc, cell, j) =>
                        rowAcc +
                        Number(
                            cell === "A" &&
                                [...Array(9).keys()]
                                    .map((i) => [(i % 3) - 1, Math.floor(i / 3) - 1])
                                    .filter(([x, y]) => x !== 0 && y !== 0)
                                    .map(
                                        ([di, dj]) =>
                                            matrix[i + di]?.[j + dj] === "M" && matrix[i - di]?.[j - dj] === "S"
                                    )
                                    .filter(Boolean).length === 2
                        ),
                    0
                ),
            0
        );
}
