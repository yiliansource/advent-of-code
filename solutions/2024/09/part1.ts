export default function (input: string): number {
    let blocks = input
        .split("")
        .map(Number)
        .flatMap((d, i) => Array(d).fill(i % 2 === 0 ? i / 2 : null));

    let i = 0,
        j = blocks.length - 1;

    while (i < j) {
        while (blocks[i] !== null) i++;
        while (blocks[j] === null) j--;
        if (i >= j) break;
        blocks[i] = blocks[j];
        blocks[j] = null;
    }

    return blocks.map(Number).reduce((acc, cur, pos) => acc + cur * pos, 0);
}
