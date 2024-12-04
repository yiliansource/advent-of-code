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
                        (cell === "X"
                            ? [...Array(9).keys()]
                                  .map((i) => [(i % 3) - 1, Math.floor(i / 3) - 1])
                                  .filter(([x, y]) => x !== 0 || y !== 0)
                                  .map(([di, dj]) =>
                                      [...Array(4).keys()].map((k) => matrix[i + di * k]?.[j + dj * k] ?? "").join("")
                                  )
                                  .filter((w) => w === "XMAS").length
                            : 0),
                    0
                ),
            0
        );
}
