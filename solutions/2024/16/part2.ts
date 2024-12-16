export default function (input: string): number {
    const maze = input.split("\n").map((l) => l.split(""));

    const sy = maze.findIndex((r) => r.includes("S"));
    const sx = maze[sy].indexOf("S");
    maze[sy][sx] = ".";

    const ey = maze.findIndex((r) => r.includes("E"));
    const ex = maze[ey].indexOf("E");
    maze[ey][ex] = ".";

    const stringifyState = (c: [number, number, number]) => c.join(",");
    const parseState = (s: string) => s.split(",").map(Number) as [number, number, number];

    const dirToCoord = (dir: number): [number, number] => {
        if (dir === 0) return [1, 0];
        if (dir === 1) return [0, -1];
        if (dir === 2) return [-1, 0];
        if (dir === 3) return [0, 1];
        throw new Error();
    };
    const nmod = (m: number, n: number) => ((m % n) + n) % n;

    const dist = new Map<string, number>();
    const prev = new Map<string, string[]>();

    const Q: string[] = [];
    Q.push(stringifyState([sx, sy, 0]));
    dist.set(stringifyState([sx, sy, 0]), 0);

    while (Q.length > 0) {
        const u = Q.pop()!;
        const [ux, uy, facing] = parseState(u);
        const [fx, fy] = dirToCoord(facing);
        const distanceToU = dist.get(u)!;

        const neighbours = [
            [ux, uy, nmod(facing - 1, 4), distanceToU + 1000],
            [ux, uy, nmod(facing + 1, 4), distanceToU + 1000],
        ];

        if (maze[uy + fy]?.[ux + fx] === ".") {
            neighbours.unshift([ux + fx, uy + fy, facing, distanceToU + 1]);
        }

        for (const [nx, ny, newFacing, newDist] of neighbours) {
            const ns = stringifyState([nx, ny, newFacing]);
            const oldDist = dist.get(ns) ?? Number.POSITIVE_INFINITY;
            if (newDist <= oldDist) {
                dist.set(ns, newDist);
                if (newDist < oldDist) {
                    prev.set(ns, [u]);
                    if (!Q.includes(ns)) Q.push(ns);
                } else {
                    prev.set(ns, [...(prev.get(ns) ?? []), u]);
                }
            }
        }
    }

    const map = Array.from(Array(maze.length).keys()).map((i) => maze[i].slice());

    const onBestPath = new Set<string>();

    const lastTileStates = Array.from(Array(4).keys()).map((d) => stringifyState([ex, ey, d]));
    const minDist = Math.min(...lastTileStates.map((s) => dist.get(s) ?? Number.POSITIVE_INFINITY));

    const stack = lastTileStates.filter((s) => dist.get(s) === minDist);
    while (stack.length > 0) {
        const t = stack.pop()!;
        const [tx, ty, _] = parseState(t);
        map[ty][tx] = "O";
        onBestPath.add([tx, ty].join(","));

        const p = prev.get(t)!;
        if (!!p) {
            stack.push(...p);
        }
    }

    return onBestPath.size;
}

// this is horribly inefficient, but i'm not sure how to do this better without a full rewrite.
