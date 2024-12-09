export default function (input: string): number {
    let blocks: (number | null)[] = input
        .split("")
        .map(Number)
        .flatMap((d, i) => Array(d).fill(i % 2 === 0 ? i / 2 : null));

    function findBlockFirst(v: number | null, offset = 0): [number, number] | null {
        for (let i = offset; i < blocks.length; i++) {
            if (blocks[i] === v) {
                for (let j = i + 1; j <= blocks.length; j++) {
                    if (blocks[j] !== v) {
                        return [i, j];
                    }
                }
            }
        }
        return null;
    }
    function findBlockLast(v: number | null, offset = 0): [number, number] | null {
        for (let i = blocks.length - 1 - offset; i >= 0; i--) {
            if (blocks[i] === v) {
                for (let j = i - 1; j >= -1; j--) {
                    if (blocks[j] !== v) {
                        return [j + 1, i + 1];
                    }
                }
            }
        }
        return null;
    }
    function findFreeSpace(length: number): [number, number] | null {
        let offset = 0;
        do {
            const query = findBlockFirst(null, offset);
            if (!query) return null;

            const [start, end] = query;
            if (end - start >= length) {
                return [start, start + length];
            }

            offset = end;
        } while (offset < blocks.length);

        return null;
    }

    let nextId = Math.floor(input.length / 2);

    do {
        const [fileStart, fileEnd] = findBlockLast(nextId)!;
        const fileLength = fileEnd - fileStart;

        const query = findFreeSpace(fileLength);
        if (!!query) {
            const [freeStart, freeEnd] = query;
            if (freeEnd <= fileStart) {
                blocks.splice(
                    freeStart,
                    fileLength,
                    ...blocks.splice(fileStart, fileLength, ...Array(fileLength).fill(null))
                );
            }
        }

        nextId--;
    } while (nextId > 0);

    return blocks.map(Number).reduce((acc, cur, pos) => acc + cur * pos, 0);
}
