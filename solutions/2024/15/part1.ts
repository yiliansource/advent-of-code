const moveDirLookup: Record<string, [number, number]> = {
    ">": [1, 0],
    v: [0, 1],
    "<": [-1, 0],
    "^": [0, -1],
};

export default function (input: string): number {
    const [mapInput, movesInput] = input.split("\n\n");
    const map = mapInput.split("\n").map((l) => l.split(""));
    const moves = movesInput.replace(/\n/g, "").split("");

    const isInBounds = ([x, y]: [number, number]): boolean => x >= 0 && y >= 0 && y < map.length && x < map[y].length;

    let ry = map.findIndex((l) => l.includes("@"));
    let rx = map[ry].indexOf("@");

    for (const move of moves) {
        const [dx, dy] = moveDirLookup[move]!;
        const targetCell = map[ry + dy]?.[rx + dx];

        if (targetCell === ".") {
            map[ry][rx] = ".";
            ry += dy;
            rx += dx;
            map[ry][rx] = "@";
        } else if (targetCell === "#") {
        } else if (targetCell === "O") {
            let k = 1;
            while (isInBounds([rx + dx * k, ry + dy * k])) {
                if (map[ry + dy * k][rx + dx * k] === "#") {
                    break;
                }
                if (map[ry + dy * k][rx + dx * k] === ".") {
                    map[ry + dy * k][rx + dx * k] = "O";
                    map[ry + dy][rx + dx] = "@";
                    map[ry][rx] = ".";

                    ry += dy;
                    rx += dx;

                    break;
                }

                k++;
            }
        }

        // console.log(move);
        // console.log(map.map((l) => l.join("")).join("\n"));
        // console.log();
    }

    let coordinateSum = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "O") {
                coordinateSum += 100 * y + x;
            }
        }
    }

    return coordinateSum;
}
