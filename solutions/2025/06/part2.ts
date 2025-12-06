export default function (input: string): number {
    const lines = input.split("\n");
    const matrix = lines.slice(0, -1);
    const operations = lines[lines.length - 1].trim().split(/ +/);

    const columnSeperators: number[] = [-1];
    columnLoop: for (let i = 0; i < matrix[0].length; i++) {
        rowLoop: for (let j = 0; j < matrix.length; j++) {
            if (matrix[j][i] !== " ") continue columnLoop;
        }

        columnSeperators.push(i);
    }
    columnSeperators.push(matrix[0].length);

    const initialValueLookup: Record<string, number> = {
        "+": 0,
        "*": 1,
    };
    const operationLookup: Record<string, (a: number, b: number) => number> = {
        "+": (a, b) => a + b,
        "*": (a, b) => a * b,
    };

    let sum = 0;
    for (let i = 0; i + 1 < columnSeperators.length; i++) {
        const rangeStart = columnSeperators[i] + 1;
        const rangeEnd = columnSeperators[i + 1];

        const operationSymbol = operations[i];
        const operation = operationLookup[operationSymbol];
        let value = initialValueLookup[operationSymbol];

        for (let k = rangeEnd - 1; k >= rangeStart; k--) {
            let digits: string = "";
            for (let j = 0; j < matrix.length; j++) {
                digits += matrix[j][k];
            }
            const number = Number(digits.trim());
            value = operation(value, number);
        }
        sum += value;
    }

    return sum;
}
