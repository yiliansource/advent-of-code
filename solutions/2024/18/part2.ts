export default function (input: string, maxCoord = 70): string {
    const coords = input.split("\n");

    const findBadCoord = (a: number, b: number): string | null => {
        const d = b - a;
        const m = Math.floor(d / 2 + a);
        if (d <= 1) {
            if (doesPathExist(coords.slice(0, a + 1), maxCoord) && !doesPathExist(coords.slice(0, b + 1), maxCoord)) {
                return coords[b];
            }
        }

        if (doesPathExist(coords.slice(0, m + 1), maxCoord)) {
            return findBadCoord(m, b);
        } else {
            return findBadCoord(a, m);
        }
    };

    return findBadCoord(0, coords.length - 1)!;
}

function doesPathExist(coords: string[], maxCoord: number): boolean {
    const stringifyCoord = (c: [number, number]) => c.join(",");
    const parseCoord = (s: string) => s.split(",").map(Number) as [number, number];

    const map = Array.from(Array(maxCoord + 1).keys()).map((y) => Array<string>(maxCoord + 1).fill("."));
    for (const [x, y] of coords.map(parseCoord)) {
        map[y][x] = "#";
    }

    const queue = [stringifyCoord([0, 0])];
    const seen = new Set<string>(queue);

    while (queue.length > 0) {
        const ms = queue.splice(0, 1)[0];
        const [mx, my] = parseCoord(ms);
        if (mx === maxCoord && my === maxCoord) {
            return true;
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
            if (seen.has(ns)) continue;
            seen.add(ns);
            queue.push(ns);
        }
    }

    // console.log(map.map((r) => r.join("")).join("\n"));

    return false;
}
