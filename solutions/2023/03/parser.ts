export default function (input: string): Plan {
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

export interface Plan {
    cells: Map<number, string>;
    width: number;
    height: number;
}
