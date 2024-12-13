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
        .map(([adx, ady, bdx, bdy, rx, ry]) => {
            let minCost = Number.POSITIVE_INFINITY;
            for (let ta = 0; ta <= 100; ta++) {
                for (let tb = 0; tb <= 100; tb++) {
                    if (ta * adx + tb * bdx === rx && ta * ady + tb * bdy === ry) {
                        minCost = Math.min(minCost, 3 * ta + tb);
                    }
                }
            }
            return Number.isFinite(minCost) ? minCost : 0;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
