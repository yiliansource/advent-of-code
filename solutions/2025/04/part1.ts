export default function (input: string): number {
    const grid = input.split("\n").map((line) => line.split(""));

    let moveableRolls = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "@") continue;

            let neighbouringRolls = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dy === 0 && dx === 0) continue;
                    if (grid[y + dy]?.[x + dx] === "@") {
                        neighbouringRolls++;
                    }
                }
            }

            if (neighbouringRolls < 4) {
                moveableRolls++;
            }
        }
    }

    return moveableRolls;
}
