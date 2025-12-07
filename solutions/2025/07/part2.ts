export default function (input: string): number {
    const lines = input.split("\n");
    const initialRayPosition = lines[0].indexOf("S");

    const rayPositions = new Set<number>([initialRayPosition]);
    const rayMultiplicities = new Map<number, number>([[initialRayPosition, 1]]);

    const addRayWithMultiplicity = (pos: number, mult: number) => {
        rayPositions.add(pos);
        const old = rayMultiplicities.get(pos) ?? 0;
        rayMultiplicities.set(pos, old + mult);
    };

    for (let i = 1; i < lines.length; i++) {
        const oldPositions = Array.from(rayPositions.values());
        const oldMultiplicities = new Map(rayMultiplicities.entries());

        rayPositions.clear();
        rayMultiplicities.clear();

        for (let j of oldPositions) {
            const mult = oldMultiplicities.get(j)!;
            if (lines[i][j] === "^") {
                addRayWithMultiplicity(j - 1, mult);
                addRayWithMultiplicity(j + 1, mult);
            } else {
                addRayWithMultiplicity(j, mult);
            }
        }
    }

    return Array.from(rayMultiplicities.values()).reduce((acc, cur) => acc + cur, 0);
}
