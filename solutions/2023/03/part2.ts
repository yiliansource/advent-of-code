export default function (input: ReturnType<typeof import("./parser.js").default>): number {
    let gearIndices = Array.from(input.cells.entries())
        .filter(([index, value]) => value === "*")
        .map(([index, value]) => index);

    let sum: number = 0;
    let visited: number[] = [];

    for (const gearIndex of gearIndices) {
        visited.push(gearIndex);

        const adjacentNumbers: number[] = [];
        for (let adjacent of getAdjacentIndices(gearIndex, input.width, input.height)) {
            if (visited.includes(adjacent)) {
                continue;
            }

            const cell = input.cells.get(adjacent)!;
            if (/\d/.test(cell)) {
                let numberString = cell;
                const x = adjacent % input.width;
                for (let i = -1; x + i >= 0 && /\d/.test(input.cells.get(adjacent + i)!); i--) {
                    visited.push(adjacent + i);
                    numberString = input.cells.get(adjacent + i)! + numberString;
                }
                for (let i = 1; x + i < input.width && /\d/.test(input.cells.get(adjacent + i)!); i++) {
                    visited.push(adjacent + i);
                    numberString = numberString + input.cells.get(adjacent + i)!;
                }

                adjacentNumbers.push(Number(numberString));
            }
        }

        if (adjacentNumbers.length === 2) {
            sum += adjacentNumbers[0] * adjacentNumbers[1];
        }
    }

    return sum;
}

function getAdjacentIndices(index: number, width: number, height: number): number[] {
    const row = Math.floor(index / width);
    const col = index % width;

    const adjacent: number[] = [];
    const adjacency: number[][] = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];
    for (let [dx, dy] of adjacency) {
        const x = col + dx;
        const y = row + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) {
            adjacent.push(y * width + x);
        }
    }

    return adjacent;
}
