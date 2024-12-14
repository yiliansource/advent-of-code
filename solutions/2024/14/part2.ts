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

    for (let seconds = 0; seconds < 10000; seconds++) {
        const counts = [...Array(height).keys()].map((y) => [...Array(width).fill(0)]);
        for (let i = 0; i < robots.length; i++) {
            const [[px, py], [vx, vy]] = robots[i];
            robots[i] = [wrapPos([px + vx, py + vy]), [vx, vy]];
            const [newX, newY] = robots[i][0];
            counts[newY][newX]++;
        }

        // idk how to do this better, but by looking at all anomalies i found the tree :)
        if (counts.filter((l) => l.reduce((acc, cur) => acc + cur, 0) >= 20).length >= 5) {
            console.log("anomaly at " + (seconds + 1) + "s:");
            console.log(counts.map((l) => l.map((v) => (v > 0 ? v : ".")).join("")).join("\n"));
        }
    }

    return -1;
}
