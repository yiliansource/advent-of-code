export default function (input: string, width = 101, height = 103): number {
    const robots = input
        .split("\n")
        .map((l) =>
            [l.match(/p=(\d+),(\d+)/)!.slice(1, 3), l.match(/v=(-?\d+),(-?\d+)/)!.slice(1, 3)].map((v) => v.map(Number))
        );

    const wrapPos = ([px, py]: [number, number]): [number, number] => [
        ((px % width) + width) % width,
        ((py % height) + height) % height,
    ];

    for (let seconds = 0; seconds < 100; seconds++) {
        for (let i = 0; i < robots.length; i++) {
            const [[px, py], [vx, vy]] = robots[i];
            robots[i] = [wrapPos([px + vx, py + vy]), [vx, vy]];
        }
    }

    const quadrantCounts: number[] = Array(4).fill(0);
    for (const [[px, py]] of robots) {
        // robots exactly in the middle do not count
        if (px === (width - 1) / 2 || py === (height - 1) / 2) {
            continue;
        }

        // calculate quadrant
        let q = 0;
        if (px >= (width - 1) / 2) q += 1;
        if (py >= (height - 1) / 2) q += 2;

        quadrantCounts[q]++;
    }

    return quadrantCounts.reduce((acc, cur) => acc * cur, 1);
}
