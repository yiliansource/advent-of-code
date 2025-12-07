export default function (input: string): number {
    const lines = input.split("\n");
    const rayPositions: Set<number> = new Set([lines[0].indexOf("S")]);

    let splits = 0;
    for (let i = 1; i < lines.length; i++) {
        const oldPositions = Array.from(rayPositions.values());
        rayPositions.clear();

        for (let j of oldPositions) {
            if (lines[i][j] === "^") {
                splits++;
                rayPositions.add(j - 1);
                rayPositions.add(j + 1);
            } else {
                rayPositions.add(j);
            }
        }
    }

    return splits;
}
