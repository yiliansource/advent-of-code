export default function (text: string): number {
    const input = parseInput(text);

    let min = Number.POSITIVE_INFINITY;
    for (const seed of input.seeds) {
        let type = "seed";
        let value = seed;

        while (type !== "location") {
            const map = input.maps[type];
            for (const range of map.ranges) {
                if (value >= range.sourceRangeStart && value < range.sourceRangeStart + range.length) {
                    value = range.destinationRangeStart + (value - range.sourceRangeStart);
                    break;
                }
            }
            type = map.output;
        }

        if (value < min) {
            min = value;
        }
    }

    return min;
}

interface Input {
    seeds: number[];
    maps: Record<
        string,
        {
            output: string;
            ranges: {
                destinationRangeStart: number;
                sourceRangeStart: number;
                length: number;
            }[];
        }
    >;
}

function parseInput(input: string): Input {
    const chunks = input.split("\n\n");
    const maps: Input["maps"] = {};

    for (const chunk of chunks.slice(1)) {
        const lines = chunk.split("\n");
        const identifier = lines[0].split(" ")[0].split("-");
        maps[identifier[0]] = {
            output: identifier[2],
            ranges: lines.slice(1).map((line) => {
                const [destinationRangeStart, sourceRangeStart, length] = line.split(" ").map(Number);
                return {
                    destinationRangeStart,
                    sourceRangeStart,
                    length,
                };
            }),
        };
    }

    return {
        seeds: chunks[0].split(": ")[1].split(" ").map(Number),
        maps,
    };
}
