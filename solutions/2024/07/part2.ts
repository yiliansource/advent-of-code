export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(/:? /).map(Number))
        .filter(([testValue, ...data]) =>
            [...Array(Math.pow(3, data.length - 1)).keys()]
                .map((i) => i.toString(3).padStart(data.length - 1, "0"))
                .map((s) => s.split("").map((d) => ["+", "*", "||"][Number(d)]))
                .some((ops) => testValue === ops.reduce((acc, op, i) => evalOp(acc, data[i + 1], op), data[0]))
        )
        .reduce((sum, [testValue]) => sum + testValue, 0);
}

function evalOp(a: number, b: number, op: string) {
    switch (op) {
        case "+":
            return a + b;
        case "*":
            return a * b;
        case "||":
            return Number(a + "" + b);
    }

    throw new Error();
}
