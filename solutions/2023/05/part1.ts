export default function (input: ReturnType<typeof import("./parser.js").default>): number {
    let min = Number.POSITIVE_INFINITY;
    for (const seed of input.seeds) {
        let type = "seed";
        let value = seed;

        console.log(`new seed ${value}`);

        while (type !== "location") {
            const map = input.maps[type];
            for (const range of map.ranges) {
                if (value >= range.sourceRangeStart && value < range.sourceRangeStart + range.length) {
                    value = range.destinationRangeStart + (value - range.sourceRangeStart);
                    break;
                }
            }
            console.log(`mapped ${type} to ${value} as ${map.output}`);
            type = map.output;
        }

        if (value < min) {
            min = value;
        }
    }

    return min;
}
