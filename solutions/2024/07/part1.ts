export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(/:? /).map(Number))
        .filter(([testValue, ...data]) =>
            [...Array(Math.pow(2, data.length - 1)).keys()]
                .map((i) => i.toString(2).padStart(data.length - 1, "0"))
                .map((s) => s.split("").map((d) => (d === "0" ? "+" : "*")))
                .some(
                    (ops) => testValue === ops.reduce((acc, op, i) => eval(acc.toString() + op + data[i + 1]), data[0])
                )
        )
        .reduce((sum, [testValue]) => sum + testValue, 0);
}
