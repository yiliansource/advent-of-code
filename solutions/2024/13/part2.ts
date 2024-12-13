export default function (input: string): number {
    return input
        .split("\n\n")
        .map((chunk) =>
            chunk.split("\n").flatMap((line) =>
                line
                    .match(/X.(\d+), Y.(\d+)/)!
                    .slice(1, 3)
                    .map(Number)
            )
        )
        .map(([adx, ady, bdx, bdy, rx, ry]) => [adx, ady, bdx, bdy, rx + 10000000000000, ry + 10000000000000])
        .map(([adx, ady, bdx, bdy, rx, ry]) => {
            const coeffDet = adx * bdy - bdx * ady;
            if (coeffDet === 0) return 0;

            // solve using cramers rule
            const ta = (rx * bdy - bdx * ry) / coeffDet;
            const tb = (adx * ry - ady * rx) / coeffDet;

            // validate solution is in appropriate domain
            if (ta >= 0 && tb >= 0 && Number.isInteger(ta) && Number.isInteger(tb)) {
                return 3 * ta + tb;
            }

            return 0;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
