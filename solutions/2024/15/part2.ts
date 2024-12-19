const moveDirLookup: Record<string, [number, number]> = {
    ">": [1, 0],
    v: [0, 1],
    "<": [-1, 0],
    "^": [0, -1],
};
const widifyLookup: Record<string, string> = {
    "#": "##",
    O: "[]",
    ".": "..",
    "@": "@.",
};

export default function (input: string): number {
    const [mapInput, movesInput] = input.split("\n\n");
    const map = mapInput.split("\n").map((l) => l.split("").flatMap((c) => widifyLookup[c].split("")));
    const moves = movesInput.replace(/\n/g, "").split("");

    const isInBounds = ([x, y]: [number, number]): boolean => x >= 0 && y >= 0 && y < map.length && x < map[y].length;
    const moveCell = ([ax, ay]: [number, number], [bx, by]: [number, number]): void => {
        map[by][bx] = map[ay][ax];
        map[ay][ax] = ".";
    };
    const moveBox = ([ax, ay]: [number, number], [bx, by]: [number, number]): void => {
        map[ay][ax] = ".";
        map[ay][ax + 1] = ".";
        map[by][bx] = "[";
        map[by][bx + 1] = "]";
    };
    const tryPushBox = ([ox, oy]: [number, number], [dx, dy]: [number, number]): boolean => {
        const t: [number, number] = [ox + dx, oy + dy];
        const [tx, ty] = t;

        if (!isInBounds(t)) {
            return false;
        }
        if (map[ty][tx] === "#") {
            return false;
        }
        if (map[ty][tx] === ".") {
            return true;
        }

        if (Math.abs(dx) === 1) {
            for (let k = 0; isInBounds([tx + dx * k, ty]) && map[ty][tx + dx * k] !== "#"; k += 2) {
                if (map[ty + dy * k][tx + dx * k] === ".") {
                    map[ty].splice(tx + dx * k, 1);
                    map[ty].splice(tx, 0, ".");
                    return true;
                }
            }
        } else {
            const [ax, ay] = [map[ty][tx] === "[" ? tx : tx - 1, ty];

            let allBoxesPushable = true;
            const boxPositions: [number, number][] = [];
            const stack: [number, number][] = [[ax, ay]];
            while (stack.length > 0) {
                const [bx, by] = stack.pop()!;
                boxPositions.push([bx, by]);
                if ((dy === 1 && by === map.length - 1) || (dy === -1 && by === 0)) {
                    allBoxesPushable = false;
                    break;
                }

                const left = map[by + dy][bx];
                const right = map[by + dy][bx + 1];

                if (left === "#" || right === "#") {
                    allBoxesPushable = false;
                    break;
                }

                if (left === "[") {
                    stack.push([bx, by + dy]);
                } else if (left === "]") {
                    stack.push([bx - 1, by + dy]);
                }

                if (right === "[") {
                    stack.push([bx + 1, by + dy]);
                }
            }

            if (allBoxesPushable) {
                for (const [bx, by] of boxPositions.sort(([bx, by], [cx, cy]) => dy * (cy - by))) {
                    moveBox([bx, by], [bx, by + dy]);
                }
                return true;
            }
        }

        return false;
    };

    let ry = map.findIndex((l) => l.includes("@"));
    let rx = map[ry].indexOf("@");

    for (const move of moves) {
        const [dx, dy] = moveDirLookup[move]!;
        if (tryPushBox([rx, ry], [dx, dy])) {
            moveCell([rx, ry], [rx + dx, ry + dy]);
            rx += dx;
            ry += dy;
        }

        // console.log(move);
        // console.log(map.map((l) => l.join("")).join("\n"));
        // console.log();
    }

    let coordinateSum = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "[") {
                coordinateSum += 100 * y + x;
            }
        }
    }

    return coordinateSum;
}
