export default function (input: string): number {
    const plan = parse(input);
    let gearIndices = Array.from(plan.cells.entries())
        .filter(([index, value]) => value === "*")
        .map(([index, value]) => index);

    let sum: number = 0;
    let visited: number[] = [];

    for (const gearIndex of gearIndices) {
        visited.push(gearIndex);

        const adjacentNumbers: number[] = [];
        for (let adjacent of getAdjacentIndices(gearIndex, plan.width, plan.height)) {
            if (visited.includes(adjacent)) {
                continue;
            }

            const cell = plan.cells.get(adjacent)!;
            if (/\d/.test(cell)) {
                let numberString = cell;
                const x = adjacent % plan.width;
                for (let i = -1; x + i >= 0 && /\d/.test(plan.cells.get(adjacent + i)!); i--) {
                    visited.push(adjacent + i);
                    numberString = plan.cells.get(adjacent + i)! + numberString;
                }
                for (let i = 1; x + i < plan.width && /\d/.test(plan.cells.get(adjacent + i)!); i++) {
                    visited.push(adjacent + i);
                    numberString = numberString + plan.cells.get(adjacent + i)!;
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

function parse(input: string): Plan {
    const cells = new Map<number, string>();
    const lines = input.split("\n");
    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            const cell = lines[row][col];
            cells.set(row * lines[row].length + col, cell);
        }
    }
    return {
        cells,
        width: lines[0].length,
        height: lines.length,
    };
}

interface Plan {
    cells: Map<number, string>;
    width: number;
    height: number;
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
