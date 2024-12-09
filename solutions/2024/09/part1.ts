export default function (input: string): number {
    let blocks = input
        .split("")
        .map(Number)
        .flatMap((d, i) => Array(d).fill(i % 2 === 0 ? i / 2 : null));

    do {
        let firstFree = blocks.indexOf(null);
        let lastFile = blocks.findLastIndex((v) => v !== null);

        if (firstFree > lastFile) break;

        [blocks[firstFree], blocks[lastFile]] = [blocks[lastFile], blocks[firstFree]];
    } while (true);

    return blocks.map(Number).reduce((acc, cur, pos) => acc + cur * pos, 0);
}
