export default function (input: string): number {
    const lines = input.split("\n");
    const matrix = lines.slice(0, -1).map((line) => line.trim().split(/ +/).map(Number));
    const operations = lines[lines.length - 1].trim().split(/ +/);

    const initialValueLookup: Record<string, number> = {
        "+": 0,
        "*": 1,
    };
    const operationLookup: Record<string, (a: number, b: number) => number> = {
        "+": (a, b) => a + b,
        "*": (a, b) => a * b,
    };

    let sum = 0;
    for (let i = 0; i < matrix[0].length; i++) {
        const operationSymbol = operations[i];
        const operation = operationLookup[operationSymbol];
        let value = initialValueLookup[operationSymbol];
        for (let j = 0; j < matrix.length; j++) {
            value = operation(value, matrix[j][i]);
        }
        sum += value;
    }

    return sum;
}
