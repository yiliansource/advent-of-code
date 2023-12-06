export default function (input: string): number {
    const data = parse(input);
    const quantities: Record<number, number> = {};
    for (let i = 0; i < data.length; i++) quantities[i] = 1;

    for (let i = 0; i < data.length; i++) {
        const [winning, mine] = data[i];

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

function parse(input: string): number[][][] {
    return input.split("\n").map((line) => {
        return line
            .split(/: +/)[1]
            .split(/ +\| +/)
            .map((parts) => parts.split(/ +/).map(Number));
    });
}
