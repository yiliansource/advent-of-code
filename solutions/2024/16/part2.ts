export default function (input: string): number {
    const maze = input.split("\n").map((l) => l.split(""));

    const sy = maze.findIndex((r) => r.includes("S"));
    const sx = maze[sy].indexOf("S");
    maze[sy][sx] = ".";

    const ey = maze.findIndex((r) => r.includes("E"));
    const ex = maze[ey].indexOf("E");
    maze[ey][ex] = ".";

    const stringifyCoord = (c: [number, number]) => c.join(",");
    const parseCoord = (s: string) => s.split(",").map(Number) as [number, number];

    const coordToDir = ([cx, cy]: [number, number]) => {
        if (cx === 1) return 0;
        if (cy === -1) return 1;
        if (cx === -1) return 2;
        if (cy === 1) return 3;
        return -1;
    };

    const dist = new Map<string, number>();
    const facing = new Map<string, number>(); // 0=east, 1=north, ...
    const prev = new Map<string, string[]>();

    const Q = new Set<string>();
    const onBestPath = new Set<string>();

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === ".") {
                const s = stringifyCoord([x, y]);
                dist.set(s, Number.POSITIVE_INFINITY);
                Q.add(s);
            }
        }
    }

    dist.set(stringifyCoord([sx, sy]), 0);
    facing.set(stringifyCoord([sx, sy]), 0);

    while (Q.size > 0) {
        let u = Q.values().next().value!;
        for (const q of Q.values()) {
            if (dist.get(q)! < dist.get(u)!) {
                u = q;
            }
        }
        const [ux, uy] = parseCoord(u);
        if (ux === ex && uy === ey) {
            break;
        }

        Q.delete(u);

        const neighbours = [
            [1, 0],
            [0, -1],
            [-1, 0],
            [0, 1],
        ]
            .map(([dx, dy]) => [ux + dx, uy + dy] as [number, number])
            .filter(([cx, cy]) => maze[cy]?.[cx] === ".")
            .map(stringifyCoord);

        for (const v of neighbours) {
            const [vx, vy] = parseCoord(v);
            const dx = vx - ux;
            const dy = vy - uy;
            const dir = coordToDir([dx, dy]);

            const oldDist = dist.get(v) ?? Number.POSITIVE_INFINITY;
            const newDist = dist.get(u)! + 1 + (dir !== facing.get(u) ? 1000 : 0);

            if (v === "3,9") {
                console.log(oldDist, newDist);
            }

            if (newDist <= oldDist) {
                dist.set(v, newDist);

                if (newDist < oldDist) {
                    prev.set(v, [u]);
                } else {
                    prev.set(v, [...(prev.get(v) ?? []), u]);
                }
            }
        }
    }

    const map = Array.from(Array(maze.length).keys()).map((i) => maze[i].slice());

    for (const c of facing.keys()) {
        const [cx, cy] = parseCoord(c);
        map[cy][cx] = [">", "^", "<", "v"][facing.get(c)!];
    }

    const stack = [stringifyCoord([ex, ey])];
    while (stack.length > 0) {
        const t = stack.pop()!;
        const [tx, ty] = parseCoord(t);
        map[ty][tx] = "O";
        onBestPath.add(t);

        const p = prev.get(t)!;
        // console.log(p);
        if (!p) {
            break;
        }

        stack.push(...p);
    }

    map[9][3] = "X";
    console.log(map.map((l) => l.join("")).join("\n"));

    return onBestPath.size;
}
