export default function (input: string, maxCoord = 70, coordCount = 1024): number {
    const coords = input
        .split("\n")
        .slice(0, coordCount)
        .map((l) => l.split(",").map(Number) as [number, number]);

    const map = Array.from(Array(maxCoord + 1).keys()).map((y) => Array<string>(maxCoord + 1).fill("."));
    for (const [x, y] of coords) {
        map[y][x] = "#";
    }

    const stringifyCoord = (c: [number, number]) => c.join(",");
    const parseCoord = (s: string) => s.split(",").map(Number) as [number, number];

    const queue = [stringifyCoord([0, 0])];
    const seen = new Set<string>();
    const dist = new Map<string, number>([[stringifyCoord([0, 0]), 0]]);
    const prev = new Map<string, string>();

    while (queue.length > 0) {
        const ms = queue.splice(0, 1)[0];
        const m = parseCoord(ms);
        const [mx, my] = m;
        if (mx === maxCoord && my === maxCoord) {
            break;
        }

        const neighbours = [
            [1, 0],
            [0, -1],
            [-1, 0],
            [0, 1],
        ]
            .map(([dx, dy]) => [mx + dx, my + dy] as [number, number])
            .filter(([nx, ny]) => map[ny]?.[nx] === ".");
        for (const n of neighbours) {
            const ns = stringifyCoord(n);
            const oldDist = dist.get(ns) ?? Number.POSITIVE_INFINITY;
            const newDist = dist.get(ms)! + 1;
            if (newDist < oldDist) {
                dist.set(ns, newDist);
                prev.set(ns, ms);
            }

            if (!seen.has(ns)) {
                queue.push(ns);
                seen.add(ns);
            }
        }
    }

    const path: string[] = [];
    let m: string | undefined = stringifyCoord([maxCoord, maxCoord]);
    while (!!m) {
        path.unshift(m);
        const [mx, my] = parseCoord(m);
        map[my][mx] = "O";
        m = prev.get(m);
    }

    // for debugging:
    // console.log(map.map((r) => r.join("")).join("\n"));

    return path.length - 1;
}
