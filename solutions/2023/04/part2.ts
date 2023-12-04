export default function (input: ReturnType<typeof import("./parser.js").default>): number {
    const quantities: Record<number, number> = {};
    for (let i = 0; i < input.length; i++) quantities[i] = 1;

    for (let i = 0; i < input.length; i++) {
        const [winning, mine] = input[i];

        let count = 0;
        const map: Record<number, boolean> = {};
        for (const a of winning) {
            map[a] = true;
        }
        for (const b of mine) {
            if (b in map) {
                count++;
            }
        }

        for (let j = 0; j < count; j++) {
            quantities[i + 1 + j] += quantities[i];
        }
    }

    return Object.values(quantities).reduce((acc, cur) => acc + cur, 0);
}
