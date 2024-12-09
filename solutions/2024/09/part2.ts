export default function (input: string): number {
    let blocks: (number | null)[] = [];
    const spaces: Record<number, number> = {};

    for (let i = 0; i < input.length; i++) {
        const d = Number(input[i]);
        const s = i % 2 === 1;
        if (s && d > 0) spaces[blocks.length] = d;

        blocks.push(...Array(d).fill(!s ? i / 2 : null));
    }

    let nextId = Math.floor(input.length / 2);

    do {
        const lastFileEnd = blocks.lastIndexOf(nextId) + 1;
        if (lastFileEnd <= 0) break;

        let lastFileStart = lastFileEnd - 1;
        while (blocks[lastFileStart - 1] === nextId) lastFileStart--;
        const lastFileLength = lastFileEnd - lastFileStart;

        console.log("moving", nextId);

        for (const key in spaces) {
            const freeIndex = Number(key);
            const freeLength = spaces[key];

            if (freeLength >= lastFileLength) {
                blocks.splice(
                    freeIndex,
                    lastFileLength,
                    ...blocks.splice(lastFileStart, lastFileLength, ...Array(lastFileLength).fill(null))
                );

                // console.log(blocks.map((v) => v ?? ".").join(""));

                const newSpace = spaces[freeIndex] - lastFileLength;
                if (newSpace > 0) spaces[freeIndex + lastFileLength] = newSpace;
                delete spaces[freeIndex];

                break;
            }
        }

        nextId--;
    } while (nextId >= 0);

    return blocks.map(Number).reduce((acc, cur, pos) => acc + cur * pos, 0);
}
