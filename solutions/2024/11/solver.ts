export default function createSolver(iterations: number): (input: string) => number {
    return (input: string): number => {
        let stones = new Map(
            input
                .split(" ")
                .map(Number)
                .map((v) => [v, 1])
        );

        for (let blinks = 0; blinks < iterations; blinks++) {
            let newStones: typeof stones = new Map();
            for (const [k, v] of stones) {
                if (k === 0) {
                    incrementMap(newStones, 1, v);
                    continue;
                }

                const s = k.toString();
                const l = s.length;
                if (l % 2 === 0) {
                    const [left, right] = [s.substring(0, l / 2), s.substring(l / 2)].map(Number);
                    incrementMap(newStones, left, v);
                    incrementMap(newStones, right, v);
                    continue;
                }

                incrementMap(newStones, k * 2024, v);
            }

            stones = newStones;
        }

        return stones.entries().reduce((acc, [_, v]) => acc + v, 0);
    };
}

function incrementMap<K>(map: Map<K, number>, key: K, inc: number) {
    map.set(key, (map.get(key) ?? 0) + inc);
}
