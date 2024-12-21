export default function (input: string, savesAtLeast = 100): number {
    const map = input.split("\n").map((l) => l.split(""));

    const sy = map.findIndex((l) => l.includes("S"));
    const sx = map[sy].indexOf("S");

    const ey = map.findIndex((l) => l.includes("E"));
    const ex = map[ey].indexOf("E");

    map[sy][sx] = ".";
    map[ey][ex] = ".";

    const stringifyCoord = (c: [number, number]) => c.join(",");
    const parseCoord = (s: string) => s.split(",").map(Number) as [number, number];

    const isInBounds = ([cx, cy]: [number, number]) => cx >= 0 && cy >= 0 && cy < map.length && cx < map[cy].length;

    function* getDNeighbours([cx, cy]: [number, number], d: number) {
        for (let dy = -d; dy <= d; dy++) {
            for (let dx = -d; dx <= d; dx++) {
                const n: [number, number] = [cx + dx, cy + dy];
                if (isInBounds(n) && Math.abs(dx) + Math.abs(dy) === d) {
                    yield n;
                }
            }
        }
    }

    const walkables: string[] = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === ".") {
                const c = stringifyCoord([x, y]);
                walkables.push(c);
            }
        }
    }

    function calculateDistanceMap(s: [number, number]): Map<string, number> {
        const Q: [number, number][] = [s];
        const dist = new Map<string, number>();
        const seen = new Set<string>();
        dist.set(stringifyCoord(s), 0);

        while (Q.length > 0) {
            const [u] = Q.splice(0, 1);
            const us = stringifyCoord(u);
            seen.add(us);
            const [ux, uy] = u;
            const neighbours = [
                [1, 0],
                [0, -1],
                [-1, 0],
                [0, 1],
            ].map(([dx, dy]) => [ux + dx, uy + dy] as [number, number]);
            for (const v of neighbours) {
                const vs = stringifyCoord(v);
                const [vx, vy] = v;
                if (map[vy]?.[vx] !== ".") continue;

                const alt = dist.get(us)! + 1;
                if (alt < (dist.get(vs) ?? Number.POSITIVE_INFINITY)) {
                    dist.set(vs, alt);
                }

                if (!seen.has(vs)) {
                    Q.push(v);
                }
            }
        }

        return dist;
    }

    console.log("d for S");
    const distS = calculateDistanceMap([sx, sy]);
    console.log("d for E");
    const distE = calculateDistanceMap([ex, ey]);

    const distWithoutCheats = distS.get(stringifyCoord([ex, ey]))!;
    const saves = new Map<number, number>();

    const offsets: [number, number][] = [];
    for (let dy = -20; dy <= 20; dy++) {
        for (let dx = -20; dx <= 20; dx++) {
            const dist = Math.abs(dx) + Math.abs(dy);
            if (dist > 1 && dist <= 20) {
                offsets.push([dx, dy]);
            }
        }
    }

    let i = 0;
    for (const ss of walkables) {
        console.log(i++ / walkables.length);
        const s = parseCoord(ss);
        const [sx, sy] = s;
        for (const [dx, dy] of offsets) {
            const [ex, ey] = [sx + dx, sy + dy];
            const es = stringifyCoord([ex, ey]);
            if (!walkables.includes(es)) continue;

            const pathLength = distS.get(ss)! + Math.abs(dx) + Math.abs(dy) + distE.get(es)!;

            const saved = distWithoutCheats - pathLength;
            if (saved > 0) {
                let p = saves.get(saved) ?? 0;
                saves.set(saved, p + 1);
            }
        }
    }

    console.log([...saves.entries()].filter(([s, c]) => s >= savesAtLeast).sort(([sa, ca], [sb, cb]) => cb - ca));

    return [...saves.entries()]
        .map(([saved, count]) => (saved >= savesAtLeast ? count : 0))
        .reduce((acc, cur) => acc + cur, 0);
}
